const Router = require("express").Router();
const ShiftMobileController = require("../../controllers/mobile/shift")
const {jwtAuthenticate}=require("../../middlewares/auth")

Router.post("/createshift",ShiftMobileController.createShift)
Router.get("/getShift",ShiftMobileController.getShift)
Router.get("/getshiftmobile",ShiftMobileController.getShiftMobile)

module.exports = Router;