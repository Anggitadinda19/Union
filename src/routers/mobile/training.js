const Router = require("express").Router();
const TrainingMobileController = require("../../controllers/mobile/training");
const { jwtAuthenticate } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/uploadImages");

Router.post(
  "/createtraining",
  upload.array("dokumentasi", 2),
  TrainingMobileController.createTraining
);
Router.get("/getTraining", TrainingMobileController.getTraining);

module.exports = Router;
