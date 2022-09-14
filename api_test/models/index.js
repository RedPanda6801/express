const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Like = require("./like");
const Post = require("./post");
const Follow = require("./follow");
const Country = require("./country");
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Follow = Follow;
db.Like = Like;
db.Country = Country;

User.init(sequelize);
Post.init(sequelize);
Follow.init(sequelize);
Like.init(sequelize);
Country.init(sequelize);

User.associate(db);
Post.associate(db);
Follow.associate(db);
Like.associate(db);
Country.associate(db);

module.exports = db;
