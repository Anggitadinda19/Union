const { response } = require("express");
const Client = require("../../models/client");

class Controller {
  static createClient(req, res, next) {
    let { idClient, namaClient } = req.body;
    Client.find({ idClient })
      .then((response) => {
        if (response.length == 0) {
          return Client.create({
            idClient,
            namaClient,
          });
        } else {
          throw { status: 400, message: "ID Client sudah digunakan" };
        }
      })
      .then((response) => {
        res.status(200).json({ message: "Berhasil untuk ditambahkan" });
      })
      .catch(next);
  }

  // static updateClient(req, res, next) {
  //   const { idClient } = req.query; // Ambil ID dari query
  //   const updateData = req.body; // Data yang akan diperbarui

  //   if (!idClient) {
  //     return res.status(400).json({ message: "ID Client diperlukan" });
  //   }

  //   Client.findOneAndUpdate(
  //     { idClient }, // Mencari berdasarkan idCabang
  //     updateData, // Data yang akan diperbarui
  //     { new: true, runValidators: true } // Mengembalikan data yang telah diperbarui dan menjalankan validasi
  //   )
  //     .then((updatedClient) => {
  //       if (!updatedClient) {
  //         return res.status(404).json({ message: "ID Client tidak ditemukan" });
  //       }
  //       res.status(200).json({
  //         message: "Nama client berhasil diperbarui",
  //         cabang: updatedClient,
  //       });
  //     })
  //     .catch(next);
  // }

  static getClient(req, res, next) {
    Client.find()
      .sort({ namaClient: 1 })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch(next);
  }
}

module.exports = Controller;
