const Router = require("koa-router");
const petCategoryController = require("../controller/categoryController.js");

const router = new Router({ prefix: "/api/petCategory" });

// 宠物类别增删改查
router.get("/", petCategoryController.list);
router.post("/", petCategoryController.create);
router.put("/:id", petCategoryController.update);
router.delete("/:id", petCategoryController.delete);

module.exports = router;
