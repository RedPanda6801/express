const express = require("express");
const { verifyToken, isLoggedIn, isNotLoggedIn } = require("./middleware");
const {
  getUser,
  updateUser,
  deleteUser,
  acceptUser,
} = require("../controllers/user");

const router = express.Router();

// 유저 정보 조회
router.get("/info", verifyToken, getUser);
// 유저 정보 수정
router.put("/update", verifyToken, updateUser);
// 유저 인증 (검증 X)
router.post("/accept", verifyToken, isNotLoggedIn, acceptUser);
// 유저 탈퇴
router.delete("/delete/:id", verifyToken, deleteUser);

// 회원 수정 기능 (닉네임만)
router.get("/modify", isLoggedIn, async (req, res) => {
  try {
    console.log(req.body);
    // const user = await User.findOne({ id: req.user.id });
    // if (user) {
    //   res.status(200).json(user.data);
    // } else {
    //   res.json({
    //     code: 400,
    //     message: "no user",
    //   });
    // }
  } catch (err) {
    return res.json({
      code: 400,
      message: "알수없는 오류",
    });
  }
});
router.post("/update", verifyToken, async (req, res) => {
  try {
    // req = {inputNick}
    const newname = req.body.inputNick;
    const user = User.findOne({
      where: { id: req.decoded.id }, // jwt에서 가져온 user Id
    });
    if (user) {
      await User.update({ nick: newname }, { where: { id: req.decoded.id } });
      res.json({
        code: 200,
        message: `${newname}으로 수정되었습니다.`,
      });
    }
  } catch (err) {
    res.json({
      code: 400,
      message: `수정할 수 없습니다.`,
    });
  }
});

// 회원 삭제 기능
router.delete("/:id/quit", verifyToken, async (req, res) => {
  try {
    // req={params: id}
    const deleteId = req.params.id;
    const findUser = await User.findOne({ where: { id: deleteId } });
    if (findUser) {
      // 회원 탈퇴를 하면 팔로우와 게시글들은 모두 삭제해야 함
      await Follow.destroy({ where: { followerId: deleteId } });
      await Follow.destroy({ where: { followingId: deleteId } });
      await Post.destroy({ where: { userId: deleteId } });
      await User.destroy({
        where: { id: findUser.id },
      });
      res.json({
        code: 200,
        message: `성공적으로 탈퇴하였습니다.`,
      });
    } else {
      res.json({
        code: 400,
        message: `삭제할 권한이 없습니다.`,
      });
    }
  } catch (err) {
    res.json({
      code: 500,
      message: `서버 오류.`,
    });
  }
});
module.exports = router;
