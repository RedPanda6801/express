// 지역 DB를 따로 두는 걸로 하자. 조회가 많기 때문
const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        // 실명 확인에서 추가
        provider: {
          type: Sequelize.STRING(13),
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(13),
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING(13),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "Users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.hasMany(db.Reply);
    db.User.hasMany(db.Reservation);
    db.User.hasMany(db.Follow, { foreignKey: "followerId", targetKey: "id" });
  }
};
