const { response } = require("express");
const moment = require("moment-timezone");
const Visit = require("../../models/visit");
// const Cabang = require("../../models/cabang");

class Controller {
  static async createVisit(req, res, next) {
    let { nama } = req.decoded;
    let {
      judul,
      idCabang,
      idClient,
      namaCabang,
      namaClient,
      tglPelaksanaan,
      deskripsi,
    } = req.body;
    // console.log(judul, idCabang,idClient,namaCabang,namaClient, tglPelaksanaan,  deskripsi, foto);
    Visit.create({
      idCabang: idCabang,
      idClient: idClient,
      namaCabang: namaCabang,
      namaClient: namaClient,
      judul: judul,
      dilaporkanOleh: nama,
      tglPelaksanaan: tglPelaksanaan,
      status: "Done",
      deskripsi: deskripsi,
      dokumentasi: req.body.foto,
    })
      .then((response) => {
        res.status(200).json({
          data: response,
          message: "Laporan visit berhasil ditambahkan",
        });
      })
      .catch(next);
  }

  static getVisit(req, res, next) {
    let { dariTgl, smpTgl, page, limit, search } = req.query;
    let tglMulai = new Date(Number(dariTgl));
    let tglSelesai = new Date(Number(smpTgl));

    let filter =
      dariTgl || smpTgl || search
        ? {
            $and: [
              {
                createdAt: {
                  $gte: tglMulai,
                  $lte: tglSelesai,
                },
              },
              search
                ? {
                    $or: [
                      { dilaporkanOleh: new RegExp(search, "i") },
                      { judul: new RegExp(search, "i") },
                    ],
                  }
                : {},
              //   shift ? { namaShift: shift } : {},
            ],
          }
        : {};

    Visit.find(filter)
      .skip(parseInt(limit) * (parseInt(page) - 1))
      .limit(parseInt(limit))
      .sort({ tglPelaksanaan: -1 })
      .then((results) => {
        const response = {
          status: 200,
          data: results,
          limit: parseInt(limit),
          page: parseInt(page),
          totalDocs: results.length, // Total dokumen dalam hasil paginasi ini
          pagingCounter: (parseInt(page) - 1) * parseInt(limit) + 1, // Counter halaman pertama dalam paginasi ini
          hasPrevPage: parseInt(page) > 1, // Memeriksa apakah ada halaman sebelumnya
          hasNextPage: results.length === parseInt(limit), // Memeriksa apakah ada halaman berikutnya
          prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null, // Nomor halaman sebelumnya jika ada
          nextPage:
            results.length === parseInt(limit) ? parseInt(page) + 1 : null, // Nomor halaman berikutnya jika ada
        };

        Visit.countDocuments(filter).then((count) => {
          response.totalDocs = count;
          // Menghitung total halaman
          response.totalPages = Math.ceil(
            count.length === 0 ? 0 : count / parseInt(limit)
          );
          res.status(200).json(response);
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      })

      .catch(next);
  }

  static grafikVisit(req, res, next) {
    let { dari, sampai } = req.query;
    let tglMulai = new Date(Number(dari));
    let tglSelesai = new Date(Number(sampai));
    let sementara1 = moment.tz(tglMulai, "Asia/Jakarta").format("YYYY-MM-DD");
    let sementara2 = moment.tz(tglSelesai, "Asia/Jakarta").format("YYYY-MM-DD");
    let bulanMulai = new Date(sementara1).getMonth() + 1; // Dapatkan bulan mulai dari filter
    let bulanSelesai = new Date(sementara2).getMonth() + 1; // Dapatkan bulan selesai dari filter
    let tahunMulai = new Date(sementara1).getFullYear(); // Dapatkan tahun mulai dari filter
    let tahunSelesai = new Date(sementara2).getFullYear();
    let newDate = new Date(sementara1);
    let newDate2 = new Date(sementara2);
    let jmlhBulan = 0;
    let dataVisitPerbulan = {};
    let hasilVisit;
    let totalVisit = 0;
    let hasilVisitMatrix = 0;
    let nilaiVisitMatrix = 0;

    if (
      newDate.getMonth() === newDate2.getMonth() &&
      newDate.getFullYear() === newDate2.getFullYear()
    ) {
      jmlhBulan = 1;
    } else {
      let yearsDifference = newDate2.getFullYear() - newDate.getFullYear();
      let monthsDifference =
        yearsDifference * 12 + newDate2.getMonth() - newDate.getMonth();

      jmlhBulan = monthsDifference + 1;
    }

    let targetPerBulan = 2;

    Visit.find({
      $or: [{ status: "Done" }],
      $and: [
        { tglPelaksanaan: { $lt: sementara2 } },
        { tglPelaksanaan: { $gt: sementara1 } },
      ],
    })
      .then((respon) => {
        let Output = [
          {
            nama: "Visit",
            "On Time": 0,
            "Not Ontime": 0,
            Target: jmlhBulan * targetPerBulan,
          },
        ];
        console.log(Output);
        for (let tahun = tahunMulai; tahun <= tahunSelesai; tahun++) {
          let bulanAwal = tahun === tahunMulai ? bulanMulai : 1;
          let bulanAkhir = tahun === tahunSelesai ? bulanSelesai : 12;

          for (let bulan = bulanAwal; bulan <= bulanAkhir; bulan++) {
            let bulanFormatted = String(bulan).padStart(2, "0");
            let bulanTahun = `${tahun}-${bulanFormatted}`;
            dataVisitPerbulan[bulanTahun] = { jumlah: 0, nilai: 1 };
          }
        }

        respon.forEach((val) => {
          //   let bulan = new Date(val.tglPelaksanaan).getMonth(); // Mendapatkan bulan dari tglPelaksanaan
          //   let tahun = new Date(val.tglPelaksanaan).getFullYear(); // Mendapatkan tahun dari tglPelaksanaan
          //   let bulanTahun = `${tahun}-${bulan}`;
          let bulan = String(
            new Date(val.tglPelaksanaan).getMonth() + 1
          ).padStart(2, "0"); // Mendapatkan bulan dari tglPelaksanaan
          let tahun = new Date(val.deadlineDate).getFullYear(); // Mendapatkan tahun dari tglPelaksanaan
          let bulanTahun = `${tahun}-${bulan}`;

          if (!dataVisitPerbulan[bulanTahun]) {
            dataVisitPerbulan[bulanTahun] = { jumlah: 0, nilai: 1 };
          }
          dataVisitPerbulan[bulanTahun].jumlah++;
          totalVisit++;

          //   let adaLebihDariSatu = false;
          //   let adaYangTidakAdaData = false;

          // Loop untuk mengecek setiap bulan dalam filter dari bulanMulai ke bulanSelesai
          for (let [bulanTahun, nilaiVisit] of Object.entries(
            dataVisitPerbulan
          )) {
            // for (let i = bulanMulai; i <= bulanSelesai; i++) {

            // let bulanTahun = `${tahunMulai}-${i}`;
            if (!dataVisitPerbulan[bulanTahun]) {
              dataVisitPerbulan[bulanTahun] = { jumlah: 0, nilai: 1 };
            }

            // Jika bulan ini tidak ada data, tandai sebagai ada yang tidak ada data
            if (nilaiVisit.jumlah === 0) {
              nilaiVisit.nilai = 1;
            } else if (nilaiVisit.jumlah === 1) {
              // Jika ada lebih dari 1 data di bulan ini, tandai sebagai lebih dari satu
              nilaiVisit.nilai = 2;
            } else if (nilaiVisit.jumlah >= targetPerBulan) {
              nilaiVisit.nilai = 3;
            }
          }
          hasilVisitMatrix = Object.values(dataVisitPerbulan).reduce(
            (acc, curr) => acc + curr.nilai,
            0
          );
          nilaiVisitMatrix = Math.round(hasilVisitMatrix / jmlhBulan);

          // if (nilaiVisitMatrix === 1) {
          //   hasilVisit = "Below"; // Jika ada bulan dengan lebih dari 1 data
          // } else if (nilaiVisitMatrix === 3) {
          //   hasilVisit = "Exceed"; // Jika ada bulan dengan lebih dari 1 data
          // } else {
          //   hasilVisit = "Meet"; // Jika setiap bulan ada tepat 1 data
          // }

          if (nilaiVisitMatrix < 2) {
            hasilVisit = "Below"; // Jika rata-rata < 2
          } else if (nilaiVisitMatrix === 2) {
            hasilVisit = "Meet"; // Jika rata-rata = 2
          } else {
            hasilVisit = "Exceed"; // Jika rata-rata > 2
          }

          // if (val.status == "Done") {
          Output[0]["On Time"]++;
          // } else if (val.status == "Done" && val.solvedInTime == false) {
          //   Output[0]["Not Ontime"]++;
          // } else if (
          //   val.status == "Received" &&
          //   new Date() <= new Date(val.deadlineDate)
          // ) {
          //   Output[0]["On Time"]++;
          // } else {
          //   Output[0]["Not Ontime"]++;
          // }
        });

        res.status(200).json({
          data: Output,
          pencapaian: hasilVisit ? hasilVisit : "Below",
          Target: jmlhBulan * targetPerBulan,
        });
      })
      .catch(next);
  }
}

module.exports = Controller;
