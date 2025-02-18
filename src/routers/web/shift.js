const Router = require("express").Router();
const ShiftController = require("../../controllers/web/shift")
const {jwtAuthenticate}=require("../../middlewares/auth")

Router.post("/createshift",ShiftController.createShift)
Router.get("/getshift",ShiftController.getShift)

module.exports = Router;