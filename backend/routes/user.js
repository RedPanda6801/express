const express = require("express");
const { verifyToken, isLoggedIn, isNotLoggedIn } = require("./middleware");
const { getUser, updateUser, deleteUser } = require("../controllers/user");

const router = express.Router();

// 유저 정보 조회
router.get("/info", verifyToken, getUser);
// 유저 정보 수정
router.put("/update", verifyToken, updateUser);
// 유저 탈퇴
router.delete("/delete/:id", verifyToken, deleteUser);
// 회원 수정 기능 (닉네임만)

module.exports = router;
