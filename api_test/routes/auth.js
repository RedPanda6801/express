const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middleware");
// 회원가입 기능
router.post("/join", async (req, res) => {
  // req = {email, password, nick}
  const { email, password, nick } = req.body;
  try {
    // 입력한 email로 UserDB의 email을 찾는다.
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // 없으면 userDB에 생성
      // password 암호화
      const hash = await bcrypt.hash(password, 12);
      const join = await User.create({
        email,
        nick,
        password: hash,
      });
      if (join) {
        res.json({
          code: 200,
          message: "success",
        });
      } else {
        res.json({
          code: 400,
          message: "failed",
        });
      }
    } else {
      res.json({
        code: 401,
        message: "existed",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: "서버 오류",
    });
  }
});

// 로그인 기능
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.json({
        code: 400,
        message: "failed",
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      const token = jwt.sign(
        {
          id: User.id,
          nick: User.nick,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m", // 30분
          issuer: "nodebird",
        }
      );
      req.session.jwt = token;
      return res.json({
        code: 200,
        message: "success",
        token
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  console.log("logout");
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
