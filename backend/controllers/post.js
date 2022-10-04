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

// 지역 별로 게시물을 가져오는 API
exports.getLocationPoster = async (req, res) => {
  try {
    const localPost = await Post.findAll({
      where: {
        location: req.user.location,
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

exports.addPoster = async (req, res) => {
  try {
    console.log("Adding Post is ready!");
    // const newPost = req.body;
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
