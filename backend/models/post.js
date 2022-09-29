const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER(50),
          allowNull: false,
        },
        country: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        item: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        views: {
          type: Sequelize.INTEGER(10),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "Posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.hasOne(db.Reservation);
    db.Post.hasOne(db.Comment);
  }
};
