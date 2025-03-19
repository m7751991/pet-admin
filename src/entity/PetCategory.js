const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: "PetCategory",
    tableName: "pet_categories",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 50,
            unique: true
        },
        createTime: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        pets: {
            type: "one-to-many",
            target: "Pet",
            inverseSide: "category"
        },
        healthRecords: {
            type: "one-to-many",
            target: "PetHealth",
            inverseSide: "category"
        }
    }
});