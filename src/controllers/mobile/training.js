const { response } = require("express");
const moment = require("moment-timezone");
const Training = require("../../models/training");
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
    let { nama } = req.decoded;
    Training.find({ dilaporkanOleh: nama })
      .sort({ tglPelaksanaan: -1 })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch(next);
  }
}

module.exports = Controller;
