const Router = require("express").Router();
const RuanganMobileController = require("../../controllers/mobile/ruangan")
const {jwtAuthenticate}=require("../../middlewares/auth")

Router.post("/createruangan",RuanganMobileController.createRuangan)
Router.get("/getruangan",RuanganMobileController.getRuangan)
Router.get("/getruanganmobile",RuanganMobileController.getRuangaanMobile)

module.exports = Router;