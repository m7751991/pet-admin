const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const jwt = require("koa-jwt");
const AppDataSource = require("./src/database");
const routes = require("./src/routes");
const cors = require("@koa/cors");

const app = new Koa();
app.use(cors());
// 使用bodyParser解析请求体
app.use(bodyParser());

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      code: ctx.status,
      message: err.message,
    };
  }
});

// JWT中间件配置
// app.use(
//   jwt({
//     secret: "1234",
//   }).unless({
//     path: [/^\/api\/auth\/login/, /^\/api\/auth\/register/],
//   })
// );
// 注册路由
app.use(routes.routes()).use(routes.allowedMethods());

// 初始化数据库连接
AppDataSource.initialize()
  .then(() => {
    console.log("数据库连接成功");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("数据库连接失败: ", error));
