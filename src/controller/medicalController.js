const AppDataSource = require("../database");
const MedicalRecord = require("../entity/MedicalRecord");
const Appointment = require("../entity/Appointment");
const Pet = require("../entity/Pet");

const medicalController = {
  // 获取所有就医记录
  async getMedicalRecords(ctx) {
    const medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);

    try {
      const records = await medicalRecordRepository.find({
        relations: ["pet"],
        order: {
          visitDate: "DESC",
        },
      });

      ctx.body = {
        code: 200,
        data: records,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取就医记录失败",
        error: error.message,
      };
    }
  },

  // 获取单条就医记录
  async getMedicalRecordById(ctx) {
    const id = ctx.params.id;
    const medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);

    try {
      const record = await medicalRecordRepository.findOne({
        where: { id },
        relations: ["pet"],
      });

      if (!record) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "就医记录不存在",
        };
        return;
      }

      ctx.body = {
        code: 200,
        data: record,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取就医记录失败",
        error: error.message,
      };
    }
  },

  // 创建就医记录
  async createMedicalRecord(ctx) {
    const recordData = ctx.request.body;
    const medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);
    const petRepository = AppDataSource.getRepository(Pet);

    try {
      // 检查宠物是否存在（如果提供了petId）
      if (recordData.petId) {
        const pet = await petRepository.findOne({
          where: { id: recordData.petId },
        });

        if (!pet) {
          ctx.status = 400;
          ctx.body = {
            code: 400,
            message: "关联的宠物不存在",
          };
          return;
        }
      }

      // 创建记录
      const newRecord = medicalRecordRepository.create(recordData);
      const result = await medicalRecordRepository.save(newRecord);

      ctx.status = 201;
      ctx.body = {
        code: 200,
        message: "就医记录创建成功",
        data: result,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "创建就医记录失败",
        error: error.message,
      };
    }
  },

  // 更新就医记录
  async updateMedicalRecord(ctx) {
    const id = ctx.params.id;
    const updateData = ctx.request.body;
    const medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);
    const petRepository = AppDataSource.getRepository(Pet);

    try {
      // 检查记录是否存在
      const record = await medicalRecordRepository.findOne({
        where: { id },
      });

      if (!record) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "就医记录不存在",
        };
        return;
      }

      // 检查宠物是否存在（如果提供了petId）
      if (updateData.petId) {
        const pet = await petRepository.findOne({
          where: { id: updateData.petId },
        });

        if (!pet) {
          ctx.status = 400;
          ctx.body = {
            code: 400,
            message: "关联的宠物不存在",
          };
          return;
        }

        record.pet = pet;
      }

      // 更新记录
      if (updateData.petName !== undefined) record.petName = updateData.petName;
      if (updateData.visitDate !== undefined) record.visitDate = updateData.visitDate;
      if (updateData.hospital !== undefined) record.hospital = updateData.hospital;
      if (updateData.doctor !== undefined) record.doctor = updateData.doctor;
      if (updateData.diagnosis !== undefined) record.diagnosis = updateData.diagnosis;
      if (updateData.prescription !== undefined) record.prescription = updateData.prescription;
      if (updateData.doctorAdvice !== undefined) record.doctorAdvice = updateData.doctorAdvice;
      if (updateData.status !== undefined) record.status = updateData.status;
      if (updateData.followUpDate !== undefined) record.followUpDate = updateData.followUpDate;
      if (updateData.cost !== undefined) record.cost = updateData.cost;

      await medicalRecordRepository.save(record);

      ctx.body = {
        code: 200,
        message: "就医记录更新成功",
        data: record,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "更新就医记录失败",
        error: error.message,
      };
    }
  },

  // 删除就医记录
  async deleteMedicalRecord(ctx) {
    const id = ctx.params.id;
    const medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);

    try {
      // 检查记录是否存在
      const record = await medicalRecordRepository.findOne({
        where: { id },
      });

      if (!record) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "就医记录不存在",
        };
        return;
      }

      // 删除记录
      await medicalRecordRepository.remove(record);

      ctx.body = {
        code: 200,
        message: "就医记录删除成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "删除就医记录失败",
        error: error.message,
      };
    }
  },

  // ========== 预约相关接口 ==========

  // 获取所有预约
  async getAppointments(ctx) {
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    try {
      const appointments = await appointmentRepository.find({
        relations: ["pet"],
        order: {
          appointmentDate: "DESC",
        },
      });

      ctx.body = {
        code: 200,
        data: appointments,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取预约记录失败",
        error: error.message,
      };
    }
  },

  // 获取单条预约
  async getAppointmentById(ctx) {
    const id = ctx.params.id;
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    try {
      const appointment = await appointmentRepository.findOne({
        where: { id },
        relations: ["pet"],
      });

      if (!appointment) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "预约记录不存在",
        };
        return;
      }

      ctx.body = {
        code: 200,
        data: appointment,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取预约记录失败",
        error: error.message,
      };
    }
  },

  // 创建预约
  async createAppointment(ctx) {
    const appointmentData = ctx.request.body;
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const petRepository = AppDataSource.getRepository(Pet);

    try {
      // 检查宠物是否存在（如果提供了petId）
      if (appointmentData.petId) {
        const pet = await petRepository.findOne({
          where: { id: appointmentData.petId },
        });

        if (!pet) {
          ctx.status = 400;
          ctx.body = {
            code: 400,
            message: "关联的宠物不存在",
          };
          return;
        }
      }

      // 创建预约
      const newAppointment = appointmentRepository.create(appointmentData);
      const result = await appointmentRepository.save(newAppointment);

      ctx.status = 201;
      ctx.body = {
        code: 200,
        message: "预约创建成功",
        data: result,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "创建预约失败",
        error: error.message,
      };
    }
  },

  // 更新预约
  async updateAppointment(ctx) {
    const id = ctx.params.id;
    const updateData = ctx.request.body;
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const petRepository = AppDataSource.getRepository(Pet);

    try {
      // 检查预约是否存在
      const appointment = await appointmentRepository.findOne({
        where: { id },
      });

      if (!appointment) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "预约记录不存在",
        };
        return;
      }

      // 检查宠物是否存在（如果提供了petId）
      if (updateData.petId) {
        const pet = await petRepository.findOne({
          where: { id: updateData.petId },
        });

        if (!pet) {
          ctx.status = 400;
          ctx.body = {
            code: 400,
            message: "关联的宠物不存在",
          };
          return;
        }

        appointment.pet = pet;
      }

      // 更新预约
      if (updateData.petName !== undefined) appointment.petName = updateData.petName;
      if (updateData.appointmentDate !== undefined) appointment.appointmentDate = updateData.appointmentDate;
      if (updateData.hospital !== undefined) appointment.hospital = updateData.hospital;
      if (updateData.department !== undefined) appointment.department = updateData.department;
      if (updateData.reason !== undefined) appointment.reason = updateData.reason;
      if (updateData.notes !== undefined) appointment.notes = updateData.notes;
      if (updateData.contactPhone !== undefined) appointment.contactPhone = updateData.contactPhone;
      if (updateData.status !== undefined) appointment.status = updateData.status;

      await appointmentRepository.save(appointment);

      ctx.body = {
        code: 200,
        message: "预约更新成功",
        data: appointment,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "更新预约失败",
        error: error.message,
      };
    }
  },

  // 取消预约
  async cancelAppointment(ctx) {
    const id = ctx.params.id;
    const appointmentRepository = AppDataSource.getRepository(Appointment);

    try {
      // 检查预约是否存在
      const appointment = await appointmentRepository.findOne({
        where: { id },
      });

      if (!appointment) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "预约记录不存在",
        };
        return;
      }

      // 更新状态为已取消
      appointment.status = "cancelled";
      await appointmentRepository.save(appointment);

      ctx.body = {
        code: 200,
        message: "预约已取消",
        data: appointment,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "取消预约失败",
        error: error.message,
      };
    }
  },
};

module.exports = medicalController;
