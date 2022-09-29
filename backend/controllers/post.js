const Post = require("../models/post");

exports.getPoster = async (req, res) => {
  try {
    const data = await Post.findAll({});
    if (data) {
      return res.json({
        code: 200,
        message: "success",
        post: data,
      });
    } else
      return res.json({
        code: 400,
        message: "Failed to Find",
      });
  } catch (err) {
    console.log(err);
    res.json({
      code: 404,
      message: "Not Found",
    });
  }
};
