const AppDataSource = require('../database');
const PetHealth = require('../entity/PetHealth');
const PetCategory = require('../entity/PetCategory');

const healthController = {
    // 获取健康监测列表
    async list(ctx) {
        const healthRepository = AppDataSource.getRepository(PetHealth);
        try {
            const records = await healthRepository.find({
                relations: ['category']
            });
            ctx.body = {
                code: 200,
                data: records
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '获取健康监测列表失败',
                error: error.message
            };
        }
    },

    // 创建健康监测记录
    async create(ctx) {
        const healthRepository = AppDataSource.getRepository(PetHealth);
        const categoryRepository = AppDataSource.getRepository(PetCategory);
        const healthData = ctx.request.body;

        try {
            const category = await categoryRepository.findOne({
                where: { id: healthData.categoryId }
            });

            if (!category) {
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    message: '宠物类别不存在'
                };
                return;
            }

            const health = healthRepository.create({
                name: healthData.name,
                age: healthData.age,
                hasVaccine: healthData.hasVaccine,
                vaccineBrand: healthData.vaccineBrand,
                vaccineCount: healthData.vaccineCount,
                hasRabiesVaccine: healthData.hasRabiesVaccine,
                category: category
            });

            await healthRepository.save(health);

            ctx.body = {
                code: 200,
                message: '创建成功',
                data: health
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '创建健康监测记录失败',
                error: error.message
            };
        }
    },

    // 更新健康监测记录
    async update(ctx) {
        const healthRepository = AppDataSource.getRepository(PetHealth);
        const categoryRepository = AppDataSource.getRepository(PetCategory);
        const id = ctx.params.id;
        const updateData = ctx.request.body;

        try {
            const health = await healthRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!health) {
                ctx.status = 404;
                ctx.body = {
                    code: 404,
                    message: '健康监测记录不存在'
                };
                return;
            }

            if (updateData.categoryId) {
                const category = await categoryRepository.findOne({
                    where: { id: updateData.categoryId }
                });
                if (!category) {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '宠物类别不存在'
                    };
                    return;
                }
                updateData.category = category;
                delete updateData.categoryId;
            }

            Object.assign(health, updateData);
            await healthRepository.save(health);

            ctx.body = {
                code: 200,
                message: '更新成功',
                data: health
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '更新健康监测记录失败',
                error: error.message
            };
        }
    },

    // 删除健康监测记录
    async delete(ctx) {
        const healthRepository = AppDataSource.getRepository(PetHealth);
        const id = ctx.params.id;

        try {
            const health = await healthRepository.findOne({
                where: { id: parseInt(id) }
            });

            if (!health) {
                ctx.status = 404;
                ctx.body = {
                    code: 404,
                    message: '健康监测记录不存在'
                };
                return;
            }

            await healthRepository.remove(health);

            ctx.body = {
                code: 200,
                message: '删除成功'
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '删除健康监测记录失败',
                error: error.message
            };
        }
    },

    // 获取单个健康监测记录
    async getOne(ctx) {
        const healthRepository = AppDataSource.getRepository(PetHealth);
        const id = ctx.params.id;

        try {
            const health = await healthRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['category']
            });

            if (!health) {
                ctx.status = 404;
                ctx.body = {
                    code: 404,
                    message: '健康监测记录不存在'
                };
                return;
            }

            ctx.body = {
                code: 200,
                data: health
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '获取健康监测记录失败',
                error: error.message
            };
        }
    }
};

module.exports = healthController;