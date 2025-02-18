const Router = require("express").Router();
const UserController = require("../../controllers/web/User");
const { jwtAuthenticate } = require("../../middlewares/auth");

Router.post("/loginweb", UserController.loginWeb);
Router.get("/refresh", jwtAuthenticate, UserController.refresh);
Router.post("/createuser", UserController.createUser);
Router.get("/getuser", UserController.getUser);
Router.patch("/updateuser", UserController.updateUser);

module.exports = Router;
