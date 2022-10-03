const Post = require("../models/post");

exports.getPoster = async (req, res) => {
  try {
    const data = await Post.findAll({});
    if (data) {
      return res.status(200).json({
        message: "success",
        post: data,
      });
    } else
      return res.status(400).json({
        message: "Failed to Find",
      });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Not Found",
    });
  }
};

// 검증되지 않은 API (미들웨어부터 확인해보자.)
exports.getCountryPoster = async (req, res) => {
  try {
    const localPost = await Post.findAll({
      where: {
        country: req.user.country,
      },
    });
    if (localPost && localPost !== []) {
      return res.status(200).json({
        message: "Get Data Success",
        post: localPost,
      });
    } else {
      return res.status(400).json({
        message: "No Data In Country",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
