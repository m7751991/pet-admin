const Router = require("koa-router");
const accountController = require("../controller/account.js");

const router = new Router({ prefix: "/api/account" });

// CRUD operations for account management
router.get("/", accountController.listAccounts);
router.post("/", accountController.addAccount);
router.put("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

module.exports = router;
