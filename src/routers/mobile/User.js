const Router = require("express").Router();
const UserMobileController = require("../../controllers/mobile/User")
const {jwtAuthenticate}=require("../../middlewares/auth")

Router.post("/loginmobile",UserMobileController.loginMobile)


module.exports = Router;