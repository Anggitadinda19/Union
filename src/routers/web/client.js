const Router = require("express").Router();
const ClientController = require("../../controllers/web/client");
const { jwtAuthenticate } = require("../../middlewares/auth");

Router.post("/createclient", ClientController.createClient);
Router.get("/getclient", ClientController.getClient);
// Router.patch("/updateclient", ClientController.updateClient);

module.exports = Router;
