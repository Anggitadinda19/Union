const { response } = require("express");
const moment = require("moment-timezone");
const Training = require("../../models/training");
const MonthlyReport = require("../../models/training");
// const Cabang = require("../../models/cabang");

class Controller {
  static async createTraining(req, res, next) {
    let { nama } = req.decoded;
    let {
      judul,
      idCabang,
      idClient,
      namaCabang,
      namaClient,
      tglPelaksanaan,
      deskripsi,
      foto,
    } = req.body;

    Training.create({
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
          message: "Laporan training berhasil ditambahkan",
        });
      })
      .catch(next);
  }

  static getTraining(req, res, next) {
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

    Training.find(filter)
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

        Training.countDocuments(filter).then((count) => {
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
      });
  }

  static grafikTraining(req, res, next) {
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
    let dataTrainingPerbulan = {};
    let hasilTraining;
    let totalTraining = 0;
    let hasilTrainingMatrix = 0;
    let nilaiTrainingMatrix = 0;

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

    Training.find({
      $or: [{ status: "Done" }],
      $and: [
        { tglPelaksanaan: { $lt: sementara2 } },
        { tglPelaksanaan: { $gt: sementara1 } },
      ],
    })
      .then((respon) => {
        let Output = [
          {
            nama: "Training Program",
            "On Time": 0,
            "Not Ontime": 0,
            Target: jmlhBulan,
          },
        ];

        console.log(Output);
        for (let tahun = tahunMulai; tahun <= tahunSelesai; tahun++) {
          let bulanAwal = tahun === tahunMulai ? bulanMulai : 1;
          let bulanAkhir = tahun === tahunSelesai ? bulanSelesai : 12;

          for (let bulan = bulanAwal; bulan <= bulanAkhir; bulan++) {
            let bulanFormatted = String(bulan).padStart(2, "0");
            let bulanTahun = `${tahun}-${bulanFormatted}`;
            dataTrainingPerbulan[bulanTahun] = { jumlah: 0, nilai: 1 };
          }
        }

        respon.forEach((val) => {
          //   let bulan = new Date(val.tglPelaksanaan).getMonth(); // Mendapatkan bulan dari tglPelaksanaan
          //   let tahun = new Date(val.tglPelaksanaan).getFullYear(); // Mendapatkan tahun dari tglPelaksanaan
          //   let bulanTahun = `${tahun}-${bulan}`;
          let bulan = String(
            new Date(val.tglPelaksanaan).getMonth() + 1
          ).padStart(2, "0"); // Mendapatkan bulan dari tglPelaksanaan

          let tahun = new Date(val.tanggalPelaksanaan).getFullYear(); // Mendapatkan tahun dari tglPelaksanaan
          let bulanTahun = `${tahun}-${bulan}`;

          if (!dataTrainingPerbulan[bulanTahun]) {
            dataTrainingPerbulan[bulanTahun] = { jumlah: 0, nilai: 1 };
          }
          dataTrainingPerbulan[bulanTahun].jumlah++;
          totalTraining++;

          // console.log(totalTraining, "??????");
          //   let adaLebihDariSatu = false;
          //   let adaYangTidakAdaData = false;

          // Loop untuk mengecek setiap bulan dalam filter dari bulanMulai ke bulanSelesai
          for (let [bulanTahun, nilaiTraining] of Object.entries(
            dataTrainingPerbulan
          )) {
            // for (let i = bulanMulai; i <= bulanSelesai; i++) {

            // let bulanTahun = `${tahunMulai}-${i}`;
            if (!dataTrainingPerbulan[bulanTahun]) {
              dataTrainingPerbulan[bulanTahun] = { jumlah: 0, nilai: 1 };
            }

            // Jika bulan ini tidak ada data, tandai sebagai ada yang tidak ada data
            if (nilaiTraining.jumlah === 0) {
              nilaiTraining.nilai = 1;
            } else if (nilaiTraining.jumlah === 1) {
              // Jika ada lebih dari 1 data di bulan ini, tandai sebagai lebih dari satu
              nilaiTraining.nilai = 2;
            } else if (nilaiTraining.jumlah > 1) {
              nilaiTraining.nilai = 3;
            }
          }

          hasilTrainingMatrix = Object.values(dataTrainingPerbulan).reduce(
            (acc, curr) => acc + curr.nilai,
            0
          );

          console.log(hasilTrainingMatrix, "HASIL");
          nilaiTrainingMatrix = Math.round(hasilTrainingMatrix / jmlhBulan);
          console.log(nilaiTrainingMatrix, "NILAI");

          if (nilaiTrainingMatrix === 1) {
            hasilTraining = "Below"; // Jika ada bulan dengan lebih dari 1 data
          } else if (nilaiTrainingMatrix === 3) {
            hasilTraining = "Exceed"; // Jika ada bulan dengan lebih dari 1 data
          } else {
            hasilTraining = "Meet"; // Jika setiap bulan ada tepat 1 data
          }

          if (val.status == "Done") {
            Output[0]["On Time"]++;
          }
          // else if (val.status == "Done" && val.solvedInTime == false) {
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

        console.log(dataTrainingPerbulan, ">>>>");
        res.status(200).json({
          data: Output,
          pencapaian: hasilTraining ? hasilTraining : "Below",
          Target: jmlhBulan,
        });
      })
      .catch(next);
  }
}

module.exports = Controller;
