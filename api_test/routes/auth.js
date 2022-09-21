const express = require("express");
const { isNotLoggedIn, verifyToken } = require("./middleware");
const { signup, signin, logout } = require("../controllers/auth");

const router = express.Router();

// 회원가입 기능
router.post("/join", signup);
// 로그인 기능
router.post("/login", isNotLoggedIn, signin);
// 로그아웃 기능
router.get("/logout", verifyToken, logout);

module.exports = router;
