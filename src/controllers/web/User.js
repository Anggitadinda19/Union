const Axios = require("axios");
const User = require("../../models/User");
const { generateTokenWOExp, generateTokenWithExp } = require("../../helpers/jwt");
const { checkPass } = require("../../helpers/hashPass");

class Controller{
static createUser(req,res,next){
    let {username,password,nama,idClient,idCabang, role, perusahaan, menu}=req.body
    User.find({username}).then((response)=>{
        if(response.length===0){
            User.create({
                username,password,nama,idClient,idCabang,role,perusahaan,menu
            });
        }else{
            throw{status:400,message:"Maaf user sudah tersedia"}
        }
    }).then((response)=>{
        res.status(200).json({message:"User berhasil di daftarkan"})
    }).catch(next)
}

static loginWeb(req, res, next) {
    let { username, password } = req.body;

    User.findOne({ username })
      .then(async (response) => {
        if (response && checkPass(password, response.password)) {
          try {
            let token = {
              idCabang: response.idCabang,
              idClient: response.idClient,
              role: response.role,
              username: response.username,
              perusahaan: response.perusahaan,
              nama:response.username,
            };
            let tokenHashed = await generateTokenWithExp(token);
            res.status(200).json({
              username: response.username,
              idClient: response.idClient,
              idCabang: response.idCabang,
              role: response.role,
              token: tokenHashed,
              menu: response.menu,
              perusahaan: response.perusahaan,
              nama:response.nama
            });
          } catch (err) {
            // console.log(err);
          }
        } else {
          throw { status: 400, message: "Username atau password anda salah!" };
        }
      })
      .catch(next);
  }
}

module.exports = Controller