const AppDataSource = require("../database");
const User = require("../entity/User");

const accountController = {
  async listAccounts(ctx) {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    ctx.body = {
      code: 200,
      data: users,
    };
  },

  async addAccount(ctx) {
    const body = ctx.request.body;
    const { username } = body;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: "用户名已存在",
      };
      return;
    }

    const user = userRepository.create(body);
    await userRepository.save(user);

    ctx.body = {
      code: 201,
      message: "用户创建成功",
      data: user,
    };
  },

  async updateAccount(ctx) {
    const { id } = ctx.params;
    const { username, password } = ctx.request.body;
    const userRepository = AppDataSource.getRepository(User);

    // Find the user by ID
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: "用户未找到",
      };
      return;
    }

    // Update user details
    user.username = username || user.username;
    user.password = password || user.password;
    await userRepository.save(user);

    ctx.body = {
      code: 200,
      message: "用户更新成功",
      data: user,
    };
  },

  async deleteAccount(ctx) {
    const { id } = ctx.params;
    const userRepository = AppDataSource.getRepository(User);

    // Find the user by ID
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: "用户未找到",
      };
      return;
    }

    // Delete the user
    await userRepository.remove(user);

    ctx.body = {
      code: 200,
      message: "用户删除成功",
    };
  },
};

module.exports = accountController;
