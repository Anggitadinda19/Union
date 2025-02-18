const Router = require("express").Router();
const ClientMobileController = require("../../controllers/mobile/client")
const {jwtAuthenticate}=require("../../middlewares/auth")

Router.post("/createclient",ClientMobileController.createClient)
Router.get("/getclient",ClientMobileController.getClient)

module.exports = Router;