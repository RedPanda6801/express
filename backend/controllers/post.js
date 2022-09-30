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

// 검증되지 않은 API (미들웨어부터 확인해보자.)
exports.getCountryPoster = async (req, res) => {
  try {
    const localPost = await Post.findAll({
      where: {
        country: req.user.country,
      },
    });
    if (localPost && localPost !== []) {
      console.log("Get Data Success");
      return res.json({
        code: 200,
        message: "Get Data Success",
        post: localPost,
      });
    } else {
      console.log("Get Failed");
      return res.json({
        code: 400,
        message: "No Data In Country",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      code: 404,
      message: "Not Found",
    });
  }
};
