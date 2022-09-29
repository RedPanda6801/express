const Sequelize = require("sequelize");

module.exports = class Reply extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        text: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Reply",
        tableName: "Replies",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsTo(db.Comment);
  }
};
