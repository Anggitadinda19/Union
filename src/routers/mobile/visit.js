const Router = require("express").Router();
const VisitMobileController = require("../../controllers/mobile/visit")
const {jwtAuthenticate}=require("../../middlewares/auth")
const { upload } = require("../../middlewares/uploadImages");

Router.post("/createvisit",upload.array("dokumentasi", 2),
VisitMobileController.createVisit)
Router.get("/getVisit",VisitMobileController.getVisit)


module.exports = Router;