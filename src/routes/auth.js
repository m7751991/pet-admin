const Router = require("koa-router");
const authController = require("../controller/authController");

const router = new Router({ prefix: "/api/auth" });

// 登录注册
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
