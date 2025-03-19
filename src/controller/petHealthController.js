const AppDataSource = require("../database");
const PetHealth = require("../entity/PetHealth");
const PetCategory = require("../entity/PetCategory");

const petHealthController = {
  // 获取宠物健康监测列表
  async getPetHealths(ctx) {
    const petHealthRepository = AppDataSource.getRepository(PetHealth);

    try {
      const petHealths = await petHealthRepository.find({
        relations: ["category"],
      });

      ctx.body = {
        code: 200,
        data: petHealths,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取宠物健康监测列表失败",
        error: error.message,
      };
    }
  },

  // 获取单个宠物健康监测信息
  async getPetHealthById(ctx) {
    const id = ctx.params.id;
    const petHealthRepository = AppDataSource.getRepository(PetHealth);

    try {
      const petHealth = await petHealthRepository.findOne({
        where: { id },
        relations: ["category"],
      });

      if (!petHealth) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "宠物健康监测信息不存在",
        };
        return;
      }

      ctx.body = {
        code: 200,
        data: petHealth,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取宠物健康监测信息失败",
        error: error.message,
      };
    }
  },

  // 添加宠物健康监测信息
  async create(ctx) {
    const petHealthData = ctx.request.body;
    const petHealthRepository = AppDataSource.getRepository(PetHealth);
    const categoryRepository = AppDataSource.getRepository(PetCategory);

    try {
      // 检查类别是否存在
      const category = await categoryRepository.findOne({
        where: { id: petHealthData.categoryId },
      });

      if (!category) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: "宠物类别不存在",
        };
        return;
      }

      // 创建宠物健康监测信息
      const petHealth = petHealthRepository.create({
        name: petHealthData.name,
        age: petHealthData.age,
        hasVaccine: petHealthData.hasVaccine,
        vaccineBrand: petHealthData.vaccineBrand,
        vaccineCount: petHealthData.vaccineCount,
        hasRabiesVaccine: petHealthData.hasRabiesVaccine,
        category: category,
      });

      await petHealthRepository.save(petHealth);

      ctx.body = {
        code: 200,
        message: "宠物健康监测信息添加成功",
        data: petHealth,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "添加宠物健康监测信息失败",
        error: error.message,
      };
    }
  },

  // 更新宠物健康监测信息
  async update(ctx) {
    const id = ctx.params.id;
    const petHealthData = ctx.request.body;
    const petHealthRepository = AppDataSource.getRepository(PetHealth);
    const categoryRepository = AppDataSource.getRepository(PetCategory);

    try {
      const petHealth = await petHealthRepository.findOne({
        where: { id },
      });

      if (!petHealth) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "宠物健康监测信息不存在",
        };
        return;
      }

      // 检查类别是否存在
      if (petHealthData.categoryId) {
        const category = await categoryRepository.findOne({
          where: { id: petHealthData.categoryId },
        });

        if (!category) {
          ctx.status = 400;
          ctx.body = {
            code: 400,
            message: "宠物类别不存在",
          };
          return;
        }

        petHealth.category = category;
      }

      // 更新宠物健康监测信息
      if (petHealthData.name) petHealth.name = petHealthData.name;
      if (petHealthData.age !== undefined) petHealth.age = petHealthData.age;
      if (petHealthData.hasVaccine !== undefined) petHealth.hasVaccine = petHealthData.hasVaccine;
      if (petHealthData.vaccineBrand !== undefined) petHealth.vaccineBrand = petHealthData.vaccineBrand;
      if (petHealthData.vaccineCount !== undefined) petHealth.vaccineCount = petHealthData.vaccineCount;
      if (petHealthData.hasRabiesVaccine !== undefined) petHealth.hasRabiesVaccine = petHealthData.hasRabiesVaccine;

      await petHealthRepository.save(petHealth);

      ctx.body = {
        code: 200,
        message: "宠物健康监测信息更新成功",
        data: petHealth,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "更新宠物健康监测信息失败",
        error: error.message,
      };
    }
  },

  // 删除宠物健康监测信息
  async delete(ctx) {
    const id = ctx.params.id;
    const petHealthRepository = AppDataSource.getRepository(PetHealth);

    try {
      const petHealth = await petHealthRepository.findOne({
        where: { id },
      });

      if (!petHealth) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "宠物健康监测信息不存在",
        };
        return;
      }

      await petHealthRepository.remove(petHealth);

      ctx.body = {
        code: 200,
        message: "宠物健康监测信息删除成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "删除宠物健康监测信息失败",
        error: error.message,
      };
    }
  },
};

module.exports = petHealthController;
