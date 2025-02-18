const { response } = require("express");
const Cabang = require("../../models/cabang");

class Controller{
  static async createCabang(req,res,next){
    let {idCabang, namaCabang,idClient} = req.body
    Cabang.find({idCabang}).then((response)=>{
      if(response.length==0){
        return Cabang.create({
          idCabang, namaCabang, idClient
        })
      } else {
        throw{status:400,message: "ID Cabang sudah digunakan"}
      } 
    })
    .then((response)=>{
      res.status(200).json({message:"Berhasil untuk ditambahkan"})
    }).catch(next)
  }

  static getCabang(req, res, next){
    Cabang.aggregate([
    {
      $lookup: {
        from: "clients",
        localField: "idClient",
        foreignField: "idClient",
        as: "listClient",
      },
    },
    {
      $unwind: {
        path: "$listClient",
        preserveNullAndEmptyArrays: true,
      },
    },
    { 
      $project: {
        _id: 1,
        idCabang:1,
        namaCabang: 1,
        idClient: "$listClient.idClient",
        namaClient: "$listClient.namaClient",
      },
    },
    { $sort: { idCabang: 1} },
    ])
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(next);
  }
}

module.exports = Controller