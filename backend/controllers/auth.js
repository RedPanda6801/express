const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { getAuthCode } = require("../methods/code");

exports.emailsender = async (req, res) => {
  try {
    const { email } = req.params;
    const code = getAuthCode();
    if (code && email) {
      // email과 code가 유효하면 메일을 보냄
      let transporter = nodemailer.createTransport({
        service: "Naver",
        host: "smtp.naver.com",
        port: 465,
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.PASSWORD, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: "TLSv1.2",
        },
      });

      let mailOption = {
        from: process.env.EMAIL,
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        html: `<h1>이메일 인증 코드입니다.</h1>
        <h2>${code}</h2>
        <h3>인증 화면으로 돌아가 입력해주세요.</h3>`, // html body
      };
      // LocalStorage에 저장하되, 암호화하여 저장 -> 코드 인증 시에 복호화하여 비교
      const hashCode = await bcrypt.hash(code, 12);
      console.log(hashCode);
      try {
        info = await transporter.sendMail(mailOption);
        console.log("메일 정보: ", info);
        return res.status(200).json({
          code: 200,
          message: "Sending Success",
          user: {
            hash: hashCode,
            email,
          },
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          code: 400,
          message: "Email Sending Failed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      code: 404,
      message: "Not Found",
    });
  }
};

exports.emailauth = async (req, res) => {
  try {
    const { email, code, hash } = req.body;
    // 복호화 해줌
    const result = await bcrypt.compare(code, hash);
    console.log(result);
    if (result) {
      return res.status(200).json({
        code: 200,
        message: "Decoding Success",
        email,
      });
    } else {
      return res.status(401).json({
        code: 401,
        message: "Decoding Failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      code: 404,
      message: "Not Found",
    });
  }
};

exports.signup = async (req, res) => {
  const { email, password, nick, name, phone, country, provider } = req.body;
  try {
    // 입력한 email로 UserDB의 email을 찾는다.
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // 없으면 userDB에 생성
      // password 암호화
      const hash = await bcrypt.hash(password, 12);
      const join = await User.create({
        // 입력한 값들에 대해 각각의 유효성 검사가 필요(백엔드에서 한번 더 처리)
        email,
        nick,
        name,
        phone,
        country,
        provider,
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
