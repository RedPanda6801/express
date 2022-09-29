const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Post = require("./post");
const Follow = require("./follow");
const Reply = require("./replies");
const Comment = require("./comments");
const Reservation = require("./reservation");

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
db.Reply = Reply;
db.Comment = Comment;
db.Reservation = Reservation;

User.init(sequelize);
Post.init(sequelize);
Follow.init(sequelize);
Reply.init(sequelize);
Reservation.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Post.associate(db);
Follow.associate(db);
Reply.associate(db);
Reservation.associate(db);
Comment.associate(db);

module.exports = db;
