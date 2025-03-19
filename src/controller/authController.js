const jwt = require("jsonwebtoken");
const AppDataSource = require("../database");
const User = require("../entity/User");

const SECRET_KEY = "1234";

const authController = {
  async login(ctx) {
    const { username, password } = ctx.request.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });
    console.log(321321);

    if (!user || user.password !== password) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: "用户名或密码错误",
      };
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: "24h" });

    ctx.body = {
      code: 200,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      },
    };
  },

  async register(ctx) {
    const { username, password } = ctx.request.body;

    const userRepository = AppDataSource.getRepository(User);

    // 检查用户名是否已存在
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: "用户名已存在",
      };
      return;
    }

    // 创建新用户
    const user = userRepository.create({
      username,
      password,
      isAdmin: false,
    });

    await userRepository.save(user);

    ctx.body = {
      code: 200,
      message: "注册成功",
    };
  },
};

module.exports = authController;
