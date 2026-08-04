"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
     * Production-таблица уже могла быть создана старым sequelize.sync().
     * Поэтому сначала проверяем её существование.
     *
     * В новой beta-БД таблицы не будет — migration создаст её.
     * В существующей production-БД migration просто будет отмечена
     * как выполненная.
     */
    const tables = await queryInterface.showAllTables();

    const tableNames = tables.map((table) =>
      typeof table === "string" ? table : table.tableName
    );

    if (tableNames.includes("dog_breeds")) {
      console.log('Table "dog_breeds" already exists, skipping creation.');
      return;
    }

    await queryInterface.createTable("dog_breeds", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("dog_breeds");
  },
};