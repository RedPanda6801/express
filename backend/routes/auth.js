const express = require("express");
const { isNotLoggedIn, verifyToken } = require("./middleware");
const {
  signup,
  signin,
  emailauth,
  emailsender,
} = require("../controllers/auth");

const router = express.Router();

// 회원가입 기능
router.post("/join", signup);
// 로그인 기능
router.post("/login", isNotLoggedIn, signin);
// 인증을 위한 이메일 발송
router.get("/send-email/:email", emailsender);
// 인증 코드에 대한 처리
router.post("/process-code", emailauth);

// 비밀번호 찾기
// router.get("/find-pass", getPassword);
// 아이디 찾기
// router.get("/find-id", getId);

module.exports = router;
