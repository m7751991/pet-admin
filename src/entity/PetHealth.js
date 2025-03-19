const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: "PetHealth",
    tableName: "pet_health",
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
        hasVaccine: {
            type: "boolean",
            default: false
        },
        vaccineBrand: {
            type: "varchar",
            length: 100,
            nullable: true
        },
        vaccineCount: {
            type: "int",
            default: 0
        },
        hasRabiesVaccine: {
            type: "boolean",
            default: false
        }
    },
    relations: {
        category: {
            type: "many-to-one",
            target: "PetCategory"
        }
    }
});