const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: "Pet",
    tableName: "pets",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 50
        },
        age: {
            type: "int"
        },
        healthStatus: {
            type: "varchar",
            length: 100
        },
        diseaseDescription: {
            type: "text",
            nullable: true
        },
        isUnderTreatment: {
            type: "boolean",
            default: false
        },
        createTime: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        category: {
            type: "many-to-one",
            target: "PetCategory"
        }
    }
});