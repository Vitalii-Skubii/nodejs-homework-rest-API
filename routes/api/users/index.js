const express = require("express");
const router = express.Router();
const controllers = require("../../../controllers/users.js");
const guard = require("../../../helpers/guard");
const validation = require("./validation");
const upload = require("../../../helpers/upload");
router.post("/registration", validation.validateRegister, controllers.reg);
router.post("/login", validation.validateLogin, controllers.login);
router.post("/logout", guard, controllers.logout);
router.post("/current", controllers.getCurrentUser);
router.patch("/avatars", [guard, upload.single("avatar")], controllers.avatars);

module.exports = router;
