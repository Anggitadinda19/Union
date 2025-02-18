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

  static getClient(req, res, next) {
    Client.find()
      .sort({ idClient: 1 })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch(next);
  }
}

module.exports = Controller;
