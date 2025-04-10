const Router = require("koa-router");
const authRoutes = require("./auth");
const petInfoRoutes = require("./petInfo");
const petHealthRoutes = require("./petHealth");
const petCategoryRoutes = require("./petCategory");
const account = require("./account");
const medicalRoutes = require("./medical");

const router = new Router();

// 路由
router.use(petInfoRoutes.routes());
router.use(petHealthRoutes.routes());
router.use(petCategoryRoutes.routes());
router.use(authRoutes.routes());
router.use(account.routes());
router.use(medicalRoutes.routes());

module.exports = router;
