const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "MedicalRecord",
  tableName: "medical_records",
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
    visitDate: {
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
    doctor: {
      type: "varchar",
      length: 50,
    },
    diagnosis: {
      type: "text",
    },
    prescription: {
      type: "text",
      nullable: true,
    },
    doctorAdvice: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 20,
      default: "pending", // pending, ongoing, completed
    },
    followUpDate: {
      type: "timestamp",
      nullable: true,
      transformer: {
        from: (value) => (value ? new Date(value) : null),
        to: (value) => value,
      },
    },
    cost: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0,
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
