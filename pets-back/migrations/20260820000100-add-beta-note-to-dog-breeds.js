"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "dog_breeds",
      "beta_note",
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "dog_breeds",
      "beta_note"
    );
  },
};