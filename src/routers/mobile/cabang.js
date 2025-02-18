const Router = require("express").Router();
const CabangMobileController = require("../../controllers/mobile/cabang")
const {jwtAuthenticate}=require("../../middlewares/auth")

Router.post("/createcabang",CabangMobileController.createCabang)
Router.get("/getcabang",CabangMobileController.getCabang)

module.exports = Router;