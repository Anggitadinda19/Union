const { ObjectId } = require("mongodb");
const moment = require("moment-timezone");
const Patrol = require("../../models/patrol");
const Ruangan = require("../../models/ruangan");
const Cabang = require("../../models/cabang");
const Shift = require("../../models/shift");

class Controller {
  static async createPatrol(req, res, next) {
    let { nama, idCabang } = req.decoded;
    let { idRuangan, idShift, status, deskripsi, nfc, temuan } = req.body;
    let date = new Date();
    let tglLaporan = moment(date).format("YYYY-MM-DD");

    let namaRuangan = await Ruangan.findOne({ _id: ObjectId(idRuangan) }).then(
      (response) => {
        return response ? response.ruangan : "Ruangan Tidak Ditemukan";
      }
    );

    let namaShift = await Shift.findOne({ _id: ObjectId(idShift) }).then(
      (response) => {
        return response ? response.shift : "Shift Tidak Ditemukan";
      }
    );

    let cabang = await Cabang.aggregate([
      { $match: { idCabang: idCabang.toString() } },
      {
        $lookup: {
          from: "clients",
          localField: "idClient",
          foreignField: "idClient",
          as: "Client",
        },
      },
      { $unwind: "$Client" },
      {
        $project: {
          idCabang: 1,
          namaCabang: 1,
          idClient: 1,
          namaClient: "$Client.namaClient",
        },
      },
      { $sort: { tglLaporan: 1 } },
    ]).then((response) => {
      return response && response.length > 0 ? response[0] : null;
    });

    // if (!cabang) {
    //     return res.status(404).json({ message: "Cabang tidak ditemukan" });
    // }

    Patrol.create({
      idCabang: cabang.idCabang,
      idClient: cabang.idClient,
      idRuangan: idRuangan,
      idShift: idShift,
      namaCabang: cabang.namaCabang,
      namaClient: cabang.namaClient,
      namaRuangan: namaRuangan,
      namaShift: namaShift,
      dilaporkanOleh: nama,
      tglLaporan: tglLaporan,
      status: status,
      deskripsi: deskripsi,
      nfc: nfc,
      temuan: temuan,
      dokumentasi: req.body.foto,
    })
      .then((response) => {
        res
          .status(200)
          .json({ data: response, message: "Laporan berhasil ditambahkan" });
      })
      .catch(next);
  }

  static getPatrol(req, res, next) {
    let { dariTgl, smpTgl, page, limit } = req.query;

    let tglMulai = new Date(Number(dariTgl));
    let tglSelesai = new Date(Number(smpTgl));

    Patrol.find({
      $and: [
        { createdAt: { $gte: new Date(tglMulai) } },
        { createdAt: { $lte: new Date(tglSelesai) } },
      ],
    })
      .skip(parseInt(limit) * (parseInt(page) - 1))
      .limit(parseInt(limit))
      .sort({ tglLaporan: -1 })
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

        Patrol.countDocuments().then((count) => {
          response.totalDocs = count;
          // Menghitung total halaman
          response.totalPages = Math.ceil(
            count.length === 0 ? 0 : count / parseInt(limit)
          );
          res.status(200).json(response);
        });
      })
      .catch((err) => {
        // console.error("Error:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      });
  }
}

module.exports = Controller;
