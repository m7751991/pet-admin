const AppDataSource = require("../database");
const PetCategory = require("../entity/PetCategory");

const categoryController = {
  // 获取所有类别
  async list(ctx) {
    const categoryRepository = AppDataSource.getRepository(PetCategory);
    try {
      const categories = await categoryRepository.find();
      ctx.body = {
        code: 200,
        data: categories,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "获取类别列表失败",
        error: error.message,
      };
    }
  },

  // 创建类别
  async create(ctx) {
    const categoryRepository = AppDataSource.getRepository(PetCategory);
    const { name } = ctx.request.body;

    try {
      // 检查类别名是否已存在
      const existingCategory = await categoryRepository.findOne({
        where: { name },
      });

      if (existingCategory) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: "类别名称已存在",
        };
        return;
      }

      const category = categoryRepository.create({ name });
      await categoryRepository.save(category);

      ctx.body = {
        code: 200,
        message: "创建成功",
        data: category,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "创建类别失败",
        error: error.message,
      };
    }
  },

  // 更新类别
  async update(ctx) {
    const categoryRepository = AppDataSource.getRepository(PetCategory);
    const id = ctx.params.id;
    const { name } = ctx.request.body;

    try {
      const category = await categoryRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!category) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "类别不存在",
        };
        return;
      }

      // 检查新名称是否与其他类别重复
      const existingCategory = await categoryRepository.findOne({
        where: { name },
      });

      if (existingCategory && existingCategory.id !== parseInt(id)) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: "类别名称已存在",
        };
        return;
      }

      category.name = name;
      await categoryRepository.save(category);

      ctx.body = {
        code: 200,
        message: "更新成功",
        data: category,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "更新类别失败",
        error: error.message,
      };
    }
  },

  // 删除类别
  async delete(ctx) {
    const categoryRepository = AppDataSource.getRepository(PetCategory);
    const id = ctx.params.id;

    try {
      const category = await categoryRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["pets", "healthRecords"],
      });

      if (!category) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: "类别不存在",
        };
        return;
      }

      // 检查是否有关联的宠物或健康记录
      if ((category.pets && category.pets.length > 0) || (category.healthRecords && category.healthRecords.length > 0)) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: "该类别下存在宠物或健康记录，无法删除",
        };
        return;
      }

      await categoryRepository.remove(category);

      ctx.body = {
        code: 200,
        message: "删除成功",
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: "删除类别失败",
        error: error.message,
      };
    }
  },
};

module.exports = categoryController;
