const Router = require("express").Router();
const VisitController = require("../../controllers/web/visit");
const { jwtAuthenticate } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/uploadImages");

Router.post(
  "/createvisit",
  upload.array("dokumentasi", 2),
  VisitController.createVisit
);
Router.get("/getvisit", VisitController.getVisit);
Router.get("/grafikvisit", VisitController.grafikVisit);

module.exports = Router;
