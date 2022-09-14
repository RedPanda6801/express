const express = require("express");
const { verifyToken, apiLimiter } = require("./middleware");
const User = require("../models/user");
const Like = require("../models/like");
const Post = require("../models/post");
const router = express.Router();

// 좋아요 추가 기능
router.post("/:id/like", verifyToken, apiLimiter, async (req, res) => {
  // req = {postId}
  try {
    const { postId } = req.body;
    const isPost = await Post.findOne({ where: { id: postId } });
    if (isPost) {
      await Like.create({
        PostId: isPost.id,
        LikerId: req.decoded.id,
      });
      res.json({
        code: 200,
        message: "좋아요를 눌렀습니다.",
      });
    } else {
      res.json({
        code: 404,
        message: "게시물을 찾을 수 없습니다.",
      });
    }
  } catch (err) {
    res.status(500).send("서버 오류");
  }
});

// 좋아요 취소 기능
router.delete("/:id/dislike", verifyToken, apiLimiter, async (req, res) => {
  // req = {postId}
  try {
    const { postId } = req.body;
    const isPost = await Like.findOne({ where: { id: postId } });
    if (isPost) {
      await Like.destroy({
        where: {
          LikerId: req.decoded.id,
        },
      });
      res.json({
        code: 200,
        message: "좋아요를 취소했습니다.",
      });
    } else {
      res.json({
        code: 404,
        message: "게시물을 찾을 수 없습니다.",
      });
    }
  } catch (err) {
    res.status(500).send("서버 오류");
  }
});

// 게시글의 좋아요 개수 확인 기능
router.post("/count", async (req, res) => {
  // 요청한 게시글의 아이디에 대한 좋아요 개수를 확인하고자 하는 api
  try {
    const posts = await Like.findAll({ where: { PostId: req.body.postId } });
    // 해당 포스트의 모든 좋아요 데이터를 가져온다.
    let count = 0;
    if (posts) {
      count = posts.length;
    } else {
      count = 0;
    }
    res.status(200).json({ count });
  } catch (err) {
    res.json({
      code: 500,
      message: "서버 오류",
    });
  }
});
module.exports = router;
