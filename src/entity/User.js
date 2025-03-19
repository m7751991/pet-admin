const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      length: 50,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 100,
    },
    registerTime: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      transformer: {
        from: (value) => (value ? new Date(value) : null),
        to: (value) => value,
      },
    },
    isAdmin: {
      type: "boolean",
      default: false,
    },
  },
});
