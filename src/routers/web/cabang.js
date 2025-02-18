const Router = require("express").Router();
const CabangController = require("../../controllers/web/cabang");
const { jwtAuthenticate } = require("../../middlewares/auth");

Router.post("/createcabang", CabangController.createCabang);
Router.get("/getcabang", CabangController.getCabang);
Router.patch("/updatecabang", CabangController.updateCabang);

module.exports = Router;
