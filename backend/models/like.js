const Sequelize = require("sequelize");

module.exports = class Like extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Like",
        tableName: "Likes",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    // user의 id를 UserId로 받아옴(1:N)
    db.Like.belongsTo(db.User, { foreignKey: "LikerId", sourceKey: "id" });
    // post의 id를 PostId로 받아옴(1:1)
    db.Post.hasOne(db.Post);
  }
};
