const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
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
};

exports.signin = async (req, res, next) => {
  // passport를 사용할지 말지를 결정해야함.
  // request에 user 정보를 실어줘야 하므로 보안성 측면과 jwt와의 중복 측면에서 고려해볼 이슈임.
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return res.status(404).json({ authError });
    }
    if (!user) {
      return res.status(400).json({
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
          id: user.id,
          nick: user.nick,
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
        token,
        // payload에 user의 값이 담겨있음
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};
