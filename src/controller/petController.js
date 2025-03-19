const AppDataSource = require("../database");
const Pet = require("../entity/Pet");
const PetCategory = require("../entity/PetCategory");

const petController = {
  // 获取宠物列表
  async list(ctx) {
    const petRepository = AppDataSource.getRepository(Pet);

    try {
      const pets = await petRepository.find({
        relations: ["category"],
      });

      ctx.body = {
        code: 200,
        data: pets,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取宠物列表失败",
        error: error.message,
      };
    }
  },

  // 获取单个宠物信息
  async getPetById(ctx) {
    const id = ctx.params.id;
    const petRepository = AppDataSource.getRepository(Pet);

    try {
      const pet = await petRepository.findOne({
        where: { id },
        relations: ["category"],
      });

      if (!pet) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "宠物不存在",
        };
        return;
      }

      ctx.body = {
        code: 200,
        data: pet,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取宠物信息失败",
        error: error.message,
      };
    }
  },

  // 添加宠物
  async createPet(ctx) {
    const petData = ctx.request.body;
    const petRepository = AppDataSource.getRepository(Pet);
    const categoryRepository = AppDataSource.getRepository(PetCategory);

    try {
      // 检查类别是否存在
      const category = await categoryRepository.findOne({
        where: { id: petData.categoryId },
      });

      if (!category) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: "宠物类别不存在",
        };
        return;
      }

      // 创建宠物
      const pet = petRepository.create({
        name: petData.name,
        age: petData.age,
        healthStatus: petData.healthStatus,
        diseaseDescription: petData.diseaseDescription,
        isUnderTreatment: petData.isUnderTreatment,
        category: category,
      });

      await petRepository.save(pet);

      ctx.body = {
        code: 200,
        message: "宠物添加成功",
        data: pet,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "添加宠物失败",
        error: error.message,
      };
    }
  },

  // 更新宠物信息
  async updatePet(ctx) {
    const id = ctx.params.id;
    const petData = ctx.request.body;
    const petRepository = AppDataSource.getRepository(Pet);
    const categoryRepository = AppDataSource.getRepository(PetCategory);

    try {
      const pet = await petRepository.findOne({
        where: { id },
      });

      if (!pet) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "宠物不存在",
        };
        return;
      }

      // 检查类别是否存在
      if (petData.categoryId) {
        const category = await categoryRepository.findOne({
          where: { id: petData.categoryId },
        });

        if (!category) {
          ctx.status = 400;
          ctx.body = {
            code: 400,
            message: "宠物类别不存在",
          };
          return;
        }

        pet.category = category;
      }

      // 更新宠物信息
      if (petData.name) pet.name = petData.name;
      if (petData.age !== undefined) pet.age = petData.age;
      if (petData.healthStatus) pet.healthStatus = petData.healthStatus;
      if (petData.diseaseDescription !== undefined) pet.diseaseDescription = petData.diseaseDescription;
      if (petData.isUnderTreatment !== undefined) pet.isUnderTreatment = petData.isUnderTreatment;

      await petRepository.save(pet);

      ctx.body = {
        code: 200,
        message: "宠物信息更新成功",
        data: pet,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "更新宠物信息失败",
        error: error.message,
      };
    }
  },

  // 删除宠物
  async deletePet(ctx) {
    const id = ctx.params.id;
    const petRepository = AppDataSource.getRepository(Pet);

    try {
      const pet = await petRepository.findOne({
        where: { id },
      });

      if (!pet) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "宠物不存在",
        };
        return;
      }

      await petRepository.remove(pet);

      ctx.body = {
        code: 200,
        message: "宠物删除成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "删除宠物失败",
        error: error.message,
      };
    }
  },
};

module.exports = petController;
