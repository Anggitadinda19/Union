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
    // console.log("req.files >>>>", req.files);
    // console.log("Foto >>>>", req.body);
    // console.log('ALAHHHHHHHHHH')

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

      .catch((error) => {
        // console.log("error >>>", error)
        res
          .status(400)
          .json({ status: 400, data: error, message: "Gagal create visit" });
      });
  }

  static getVisit(req, res, next) {
    let { nama } = req.decoded;
    Visit.find({ dilaporkanOleh: nama })
      .sort({ tglPelaksanaan: -1 })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch(next);
  }

  // static test(req, res, next) {
  //   console.log("YIHAAAAA");
  // }
}

module.exports = Controller;
