const Router = require("express").Router();
const UserController = require("../../controllers/web/User")
const {jwtAuthenticate}=require("../../middlewares/auth")

Router.post("/createuser",UserController.createUser)


module.exports = Router;