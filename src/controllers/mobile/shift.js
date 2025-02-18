const Shift = require("../../models/shift");
const moment = require("moment-timezone");

class Controller {
  static createShift(req, res, next) {
    let { idCabang, namaShift, durasi, patroli, jam, status } = req.body;
    // jam = parseInt(jam);
    Shift.create({ idCabang, namaShift, durasi, patroli, jam, status })
      .then((response) => {
        res.status(200).json({ message: "Data berhasil ditambahkan" });
      })
      .catch(next);
  }

  static getShift(req, res, next) {
    Shift.aggregate([
      {
        $lookup: {
          from: "cabangs",
          localField: "idCabang",
          foreignField: "idCabang",
          as: "listCabang",
        },
      },
      { $unwind: { path: "$listCabang", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          idCabang: "$listCabang.idCabang",
          namaCabang: "$listCabang.namaCabang",
          namaShift: 1,
          durasi: 1,
          patroli: 1,
          jam: 1,
          status: 1,
        },
      },
      { $sort: { namaShift: 1 } },
    ])
      .then((response) => {
        res.status(200).json(response);
      })
      .catch(next);
  }

  static getShiftMobile(req, res, next) {
    let { time } = req.query;
    let { idCabang } = req.decoded;
    let now = time ? parseInt(time) : moment().tz("Asia/Jakarta").hours();

    if (isNaN(now) || now < 0 || now > 23) {
      return res.status(400).json({ message: "Parameter time tidak valid" });
    }

    Shift.find({ idCabang })
      .sort({ namaShift: 1 })
      .then((shifts) => {
        let currentShifts = shifts.filter((shift) => {
          let shiftSelesai = shift.jam;
          let shiftMulai = (shiftSelesai - shift.durasi + 24) % 24;

          if (shiftMulai <= shiftSelesai) {
            return now >= shiftMulai && now < shiftSelesai;
          } else {
            return now >= shiftMulai || now < shiftSelesai;
          }
        });

        if (currentShifts.length === 0) {
          return res
            .status(404)
            .json({ message: "Tidak ada shift yang sedang berlangsung" });
        }

        res.status(200).json(currentShifts);
      })
      .catch(next);
  }
}

module.exports = Controller;
