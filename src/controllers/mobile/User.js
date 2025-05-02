const Axios = require("axios");
const User = require("../../models/User");
const {
  generateTokenWOExp,
  generateTokenWithExp,
} = require("../../helpers/jwt");
const { checkPass } = require("../../helpers/hashPass");

class Controller {
  static loginMobile(req, res, next) {
    let { username, password } = req.body;
    // console.log(username,password,">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    Axios.get(
      `https://backoffice.bapguard.com/api/jtilogin?nopeg=${username}&password=${password}`
      // `http://localhost:8888/backoffice/public/api/jtilogin?nopeg=${username}&password=${password}`
    )
      .then(async (response) => {
        let data = response.data.data[0];
        const arrPerusahaan = ["PT. Thai Union Kharisma Lestari"];
        const jabatan = "Komandan Regu";
        if (
          arrPerusahaan.includes(data.nama_perusahaan) ||
          data.nopeg == "00001569"
        ) {
          try {
            if (data.nopeg == "00001569") {
              // if (data.jabatan != jabatan) {
              //   res
              //     .status(400)
              //     .json({ message: "Maaf anda bukan komandan regu" });
              // } else {
              let token = {
                cabang: data.nama_cabang,
                nama: data.nama_karyawan,
                perusahaan: data.nama_perusahaan,
                nopeg: data.nopeg,
                idCabang: data.id_cabang,
                pic: true,
              };
              console.log(token, "TOKEN1");

              let tokenHashed = await generateTokenWOExp(token);
              res.status(200).json({ ...data, tokenHashed });
              // }
            } else {
              let token = {
                cabang: data.nama_cabang,
                nama: data.nama_karyawan,
                perusahaan: data.nama_perusahaan,
                nopeg: data.nopeg,
                idCabang: data.id_cabang,
                pic: false,
              };
              let tokenHashed = await generateTokenWOExp(token);
              res.status(200).json({ ...data, tokenHashed });
            }
          } catch {}
          // try {
          //   if (data.jabatan != jabatan) {
          //     res
          //       .status(400)
          //       .json({ message: "Maaf anda bukan komandan regu" });
          //   } else {
          // let token = {
          //   cabang: data.nama_cabang,
          //   nama: data.nama_karyawan,
          //   perusahaan: data.nama_perusahaan,
          //   nopeg: data.nopeg,
          //   idCabang: data.id_cabang,
          // };
          // let tokenHashed = await generateTokenWOExp(token);
          // res.status(200).json({ ...data, tokenHashed });
          // }
          // } catch (err) {
          //   // console.log(err);
          // }
        } else {
          res
            .status(400)
            .json({ message: "Maaf anda bukan karyawan PT. Thai Union ..." });
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          res.status(400).json({
            status: 400,
            message: err.response.data.message,
          });
        } else {
          next(err);
        }
      });
  }
}

module.exports = Controller;
