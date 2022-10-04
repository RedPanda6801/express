const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { getAuthCode } = require("../methods/code");

const mailList = ["naver", "gmail", "daum", "kakao"];

// 인증번호를 이메일로 보내는 API
exports.emailsender = async (req, res) => {
  try {
    const { email } = req.params;
    // 메일에 보낼 인증 코드를 생성, DB에 암호화하여 임시 보관
    const code = getAuthCode();
    const hashCode = await bcrypt.hash(code, 12);
    console.log("hashing code : ", hashCode);

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
        subject: "🥕당근마켓 인증 코드 발송 메일🥕", // Subject line
        html: `<h1>이메일 인증 코드입니다.</h1>
        <h2>${code}</h2>
        <h3>인증 화면으로 돌아가 입력해주세요.</h3>`, // html body
      };

      try {
        // db에 동일한 이메일이 있는지 확인
        const user = await User.findOne({ where: { email } });
        if (!user) {
          await User.create({
            // 입력한 값들에 대해 각각의 유효성 검사가 필요(백엔드에서 한번 더 처리)
            email,
            nick: "",
            name: "",
            phone: "",
            location: "",
            provider: "",
            password: "",
            hashCode,
          });
          info = await transporter.sendMail(mailOption);
          console.log("Sending Mail - response : ", info);

          return res.status(200).json({
            message: "Sending Success",
          });
        } else {
          return res.status(400).json({
            message: "Already Existed User",
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(404).json({
          message: "Email Sending Failed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

// 이메일 인증
exports.emailauth = async (req, res) => {
  try {
    // 이메일과 인증 코드를 post로 받아옴
    const { email, code } = req.body;
    // 인증코드를 받은 이메일을 가져옴
    const AuthUser = await User.findOne({ where: { email } });
    if (AuthUser.hashCode) {
      // hashCode 값이 null이 아니면 받아온 코드와 비교
      const result = await bcrypt.compare(code, AuthUser.hashCode);
      console.log("bcrypt response - isAuth : ", result);

      if (result) {
        return res.status(200).json({
          message: "Decoding Success",
          email,
          code,
        });
      } else {
        return res.status(401).json({
          message: "Decoding Failed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

exports.signup = async (req, res) => {
  try {
    // code는 localStorage에 저장된 값을 가져옴
    const { email, password, nick, name, phone, location, code } = req.body;
    // 요구하는 입력이 전부 들어왔는지 확인
    if (email && password && nick && name && phone && location) {
      const domain = email.split("@")[1];
      const provider = domain.split(".")[0];
      if (!mailList.find((mail) => mail === provider)) {
        return res.status(400).json({
          message: "Doamin didn't Provided",
        });
      }
      // 입력한 email로 UserDB의 email을 확인
      const user = await User.findOne({ where: { email } });
      // 이메일을 보낸 user에 한하여 코드를 진행
      if (user.hashCode) {
        // 외부에서 바로 '/join'으로 회원가입하는 잘못된 접근에 대한 인증 절차
        const codeCheck = await bcrypt.compare(code, user.hashCode);
        console.log("Auth Before Join - response : ", codeCheck);
        if (codeCheck) {
          // password 암호화
          const hash = await bcrypt.hash(password, 12);
          const join = await User.update(
            {
              // 입력한 값들에 대해 각각의 유효성 검사가 필요(백엔드에서 한번 더 처리)
              nick,
              name,
              phone,
              location,
              provider,
              password: hash,
              hashCode: null,
            },
            { where: { email } }
          );
          if (join) {
            res.status(200).json({
              message: "success",
            });
          } else {
            res.status(400).json({
              message: "failed",
            });
          }
        }
      } else {
        return res.status(401).json({
          message: "Wrong Access - Not Authentication",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
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
          issuer: "Dangun Farmer",
        }
      );
      req.session.jwt = token;
      return res.status(200).json({
        message: "success",
        token,
        // payload에 user의 값이 담겨있음
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};
