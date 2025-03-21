const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Appointment",
  tableName: "appointments",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    petName: {
      type: "varchar",
      length: 50,
    },
    appointmentDate: {
      type: "timestamp",
      transformer: {
        from: (value) => (value ? new Date(value) : null),
        to: (value) => value,
      },
    },
    hospital: {
      type: "varchar",
      length: 100,
    },
    department: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    reason: {
      type: "text",
    },
    notes: {
      type: "text",
      nullable: true,
    },
    contactPhone: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 20,
      default: "pending", // pending, confirmed, cancelled
    },
    createTime: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      transformer: {
        from: (value) => (value ? new Date(value) : null),
        to: (value) => value,
      },
    },
  },
  relations: {
    pet: {
      type: "many-to-one",
      target: "Pet",
      joinColumn: {
        name: "petId",
        referencedColumnName: "id",
      },
      nullable: true,
    },
  },
});
