const Router = require("koa-router");
const medicalController = require("../controller/medicalController");

const router = new Router({ prefix: "/api/medical" });

// 就医记录路由
router.get("/records", medicalController.getMedicalRecords);
router.get("/record/:id", medicalController.getMedicalRecordById);
router.post("/record", medicalController.createMedicalRecord);
router.put("/record/:id", medicalController.updateMedicalRecord);
router.delete("/record/:id", medicalController.deleteMedicalRecord);

// 预约路由
router.get("/appointments", medicalController.getAppointments);
router.get("/appointment/:id", medicalController.getAppointmentById);
router.post("/appointment", medicalController.createAppointment);
router.put("/appointment/:id", medicalController.updateAppointment);
router.put("/appointment/:id/cancel", medicalController.cancelAppointment);

module.exports = router;
