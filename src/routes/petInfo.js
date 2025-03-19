const Router = require("koa-router");
const petInfoController = require("../controller/petController.js");

const router = new Router({ prefix: "/api/petInfo" });

// 宠物信息增删改查
router.get("/", petInfoController.list);
router.get("/:id", petInfoController.getPetById);
router.post("/", petInfoController.createPet);
router.put("/:id", petInfoController.updatePet);
router.delete("/:id", petInfoController.deletePet);

module.exports = router;
