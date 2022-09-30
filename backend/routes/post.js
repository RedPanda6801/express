const express = require("express");
const { verifyToken, apiLimiter, checkUserOAuth } = require("./middleware");
const User = require("../models/user");
const Follow = require("../models/follow");
const Post = require("../models/post");

const { getPoster, getCountryPoster } = require("../controllers/post");
const router = express.Router();

// 모든 게시글 출력 기능(모두 권한 O)
router.get("/all", getPoster);

// 인증한 사람의 지역에 대한 데이터들만 가져옴
router.get("/country", verifyToken, checkUserOAuth, getCountryPoster);

// router.get("/", verifyToken, apiLimiter, async (req, res) => {
//   res.sendFile(path.join(__dirname, "../views/post.html"));
// });
router.get("/show", verifyToken, apiLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.decoded.id } });
    if (user) {
      const getContent = await Post.findAll({
        include: [{ model: User }],
      });
      // 모든 Post의 DB를 가져와서 json으로 출력(가져올땐 req.content, req.user이고 각각은 배열)
      res.status(200).json(getContent);
    }
  } catch (err) {
    res.json({
      code: 500,
      message: "서버오류.",
    });
  } // res.json({ code : 500, message : "서버의 오류입니다."})
});

// 게시글 추가 기능
router.post("/append", verifyToken, apiLimiter, async (req, res) => {
  try {
    // req = { userId, content, img}
    const { content, img } = req.body;
    const user = await User.findOne({ where: { id: req.decoded.id } });
    if (user) {
      // user가 글을 작성할 권한을 갖는다
      const appendPost = await Post.create({
        content,
        img,
        UserId: req.decoded.id,
      });
      console.log(appendPost);
      res.json({
        code: 204,
        message: "성공적으로 게시글이 추가되었습니다.",
      });
    } else {
      res.json({
        code: 400,
        message: "게시글을 추가할 권한이 없습니다.",
      });
    }
  } catch (err) {
    res.json({
      code: 500,
      message: "서버오류.",
    });
  }
});

// 게시글 수정 기능
router.put(
  "/:content/:img/update",
  /*verifyToken, apiLimiter,*/ async (req, res) => {
    try {
      const { content, img, userId } = req.params;
      if (userId == req.user.id) {
        // 수정을 요청한 사람과 post를 작성한 사람이 같으면

        const updateContent = await Post.update(
          {
            userId,
            content,
            img,
          },
          {
            where: { userId: req.user.id },
          }
        );
        res.status(204).send("정상적으로 수정하였습니다.");
      } else {
        res.status(401).send("수정할 권한이 없습니다.");
      }
    } catch (err) {
      res.status(500).send("서버 오류");
    }
  }
);

// 게시글 삭제 기능
router.delete(
  "/:postId/quit",
  /*verifyToken, apiLimiter,*/ async (req, res) => {
    try {
      const { postId } = req.params;
      const findPost = await Post.findOne({ where: { id: postId } });

      if (findPost.userId == req.decoded.id) {
        // 삭제를 요청한 사람과 post를 작성한 사람이 같으면
        const deleteContent = await Post.delete({
          where: { userId: req.decoded.id },
        });
        res.status(204).send("정상적으로 수정하였습니다.");
      } else {
        res.status(401).send("수정할 권한이 없습니다.");
      }
    } catch (err) {
      res.status(500).send("서버 오류");
    }
  }
);

// 팔로우 기능
router.post("/follow", verifyToken, apiLimiter, async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const followingPost = await Post.findOne({ where: { id: postId } });
    // 팔로우할 게시글을 가져온다.
    if (followingPost) {
      const followingId = followingPost.UserId; // 가져오면 id 출력
      if (!followingId) {
        res.json({
          code: 401,
          message: "자신은 팔로워할 수 없습니다.",
        });
      } else {
        await Follow.create({
          followerId: req.decoded.id, // 팔로우 하는 사람은 jwt토큰에서 가져온 친구들
          followingId,
        });
        res.json({
          code: 204,
          message: `팔로우하였습니다.`,
        });
      }
    } else {
      res.json({
        code: 404,
        message: "해당 유저를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 언팔로우 기능
router.delete("/:id/unfollow", verifyToken, apiLimiter, async (req, res) => {
  try {
    const unfollowId = req.params.id; // 언팔로우 하는 user의 id
    const unfollowing = await User.findOne({ where: { id: unfollowId } });
    if (!unfollowing) {
      res.json({
        code: 404,
        message: "해당 유저를 찾을 수 없습니다.",
      });
    } else {
      const unfollow = await Follow.destroy({
        where: { followingId: unfollowing.id },
      });
      res.json({
        code: 204,
        message: `언팔로우하셨습니다.`,
      });
    }
  } catch (err) {
    res.json({
      code: 404,
      message: "해당 유저를 찾을 수 없습니다.",
    });
  }
});

module.exports = router;
