const Router = require("express").Router();
const PatrolMobileController = require("../../controllers/mobile/patrol")
const {jwtAuthenticate}=require("../../middlewares/auth")
const { upload } = require("../../middlewares/uploadImages");

Router.post("/createpatrol",
    upload.array("dokumentasi", 2),
    PatrolMobileController.createPatrol)
Router.get("/getPatrol",PatrolMobileController.getPatrol)


module.exports = Router;