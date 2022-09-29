const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
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
        modelName: "Comment",
        tableName: "Comments",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsTo(db.Post);
    db.Post.hasOne(db.Reply);
  }
};
