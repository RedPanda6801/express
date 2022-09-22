const Sequelize = require('sequelize');

module.exports = class Follow extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      followingId: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Follow',
      tableName: 'Follows',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Follow.belongsTo(db.User, {foreignKey: 'followerId', sourceKey: 'id'});
  }
};
