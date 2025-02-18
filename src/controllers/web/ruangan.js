const { response } = require("express");
const Ruangan = require("../../models/ruangan");

class Controller{
  static createRuangan(req,res,next){
    let {idCabang, ruangan, idClient} = req.body
    console.log(req.body,"KKK")
    Ruangan.find({ruangan}).then((response)=>{
      if(response.length===0){
        return Ruangan.create({
          idCabang, ruangan, idClient
        }).then((response)=>{
          return Ruangan.findByIdAndUpdate(response._id, {
            kodeRuangan: String(response._id).slice(
              String(response._id).length - 6,
              String(response._id).length
            ),
          });
        })
      } else {
        
        throw{status:400,message: "Ruangan sudah terdaftar"}
      }
    }).then((response)=>{
      res.status(200).json({message:"Ruangan baru berhasil ditambahkan"})
    }).catch(next)
  }

  static getRuangan(req, res, next){
    Ruangan.aggregate([
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
          ruangan:1,
          idCabang: "$listCabang.idCabang",
          namaCabang: "$listCabang.namaCabang",
          idClient: "$listClient.idClient",
          namaClient: "$listClient.namaClient",
        },
      },
      { $sort: { ruangan: 1} },
    ])
    .then((response)=>{
      res.status(200).json(response)
    }).catch(next)
  }
}

module.exports = Controller