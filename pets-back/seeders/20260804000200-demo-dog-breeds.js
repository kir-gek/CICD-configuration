"use strict";

const TEST_BREEDS = [
  {
    title: "Лабрадор",
    description: "Дружелюбная и активная порода",
  },
  {
    title: "Корги",
    description: "Невысокая пастушья порода",
  },
  {
    title: "Хаски",
    description: "Энергичная северная порода",
  },
];

module.exports = {
  async up(queryInterface) {
    const [existingRows] = await queryInterface.sequelize.query(
      'SELECT "title" FROM "dog_breeds";'
    );

    const existingTitles = new Set(
      existingRows.map((row) => row.title)
    );

    const now = new Date();

    const missingBreeds = TEST_BREEDS
      .filter((breed) => !existingTitles.has(breed.title))
      .map((breed) => ({
        ...breed,
        createdAt: now,
        updatedAt: now,
      }));

    if (missingBreeds.length === 0) {
      console.log("All beta breeds already exist, skipping seed.");
      return;
    }

    await queryInterface.bulkInsert("dog_breeds", missingBreeds);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("dog_breeds", {
      title: {
        [Sequelize.Op.in]: TEST_BREEDS.map((breed) => breed.title),
      },
    });
  },
};