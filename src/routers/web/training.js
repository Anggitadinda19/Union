const Router = require("express").Router();
const TrainingController = require("../../controllers/web/training")
const {jwtAuthenticate}=require("../../middlewares/auth")
const { upload } = require("../../middlewares/uploadImages");


Router.post("/createtraining",upload.array("dokumentasi", 2), TrainingController.createTraining)
Router.get("/gettraining",TrainingController.getTraining)
Router.get("/grafiktraining",TrainingController.grafikTraining)

module.exports = Router;