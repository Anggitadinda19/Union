const { response } = require("express");
const Shift = require("../../models/shift");

class Controller{
  static createShift(req,res,next){
    let {idCabang, namaShift, durasi, patroli, jam, status} = req.body
    
    Shift.create({idCabang, namaShift, durasi, patroli, jam, status})
    .then((response) => {
      res.status(200).json({message:"Data berhasil ditambahkan"})
    })
    .catch(next)  
  }

  static getShift(req, res, next){
    Shift.aggregate([
      {
        $lookup: {
          from: "cabangs",
          localField: "idCabang",
          foreignField: "idCabang",
          as: "listCabang",
        },
      },
      {
        $unwind: {
          path: "$listCabang",
          preserveNullAndEmptyArrays: true,
        },
      },
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
      { $sort: { namaShift: 1} },
    ])
    .then((response)=>{
      res.status(200).json(response)
    }).catch(next)
  }
}

module.exports = Controller