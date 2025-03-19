const Router = require("koa-router");
const petHealthController = require("../controller/petHealthController.js");

const router = new Router({ prefix: "/api/petHealth" });

// 宠物健康增删改查
router.get("/", petHealthController.getPetHealths);
router.get("/:id", petHealthController.getPetHealthById);
router.post("/", petHealthController.create);
router.put("/:id", petHealthController.update);
router.delete("/:id", petHealthController.delete);

module.exports = router;
