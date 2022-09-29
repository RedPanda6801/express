// 유저 정보 조회 (O)
// 카카오 로그인으로 사용자 인증
// 유저 정보 수정 (O)
// 유저 탈퇴 (O)
const passport = require("passport");
const { Follow, Post, User } = require("../models");

exports.getUser = async (req, res) => {
  try {
    // jwt토큰의 payload로 User DB에서 user를 찾음
    const user = await User.findOne({ where: { id: req.decoded.id } });
    if (user) {
      // 수정한 정보를 객체로 넘겨줌
      const result = {
        email: user.email,
        nick: user.nick,
        name: user.name,
        phone: user.phone,
        location: user.location,
      };
      return res.json({
        code: 200,
        user: result,
      });
    } else {
      // 유저를 찾지 못했다면
      return res.json({
        code: 400,
        message: "No User",
      });
    }
  } catch (err) {
    return res.json({
      code: 404,
      message: "Failed",
    });
  }
};
exports.updateUser = async (req, res) => {
  // body = {email, location, nick, phone}
  console.log(req.body);
  try {
    const user = await User.findOne({ id: req.decoded.id });
    if (user) {
      try {
        // request가 있는 값만 수정하도록 함
        await User.update(
          {
            location: req.body.location ? req.body.location : user.location,
            email: req.body.email ? req.body.email : user.email,
            nick: req.body.nick ? req.body.nick : user.nick,
            phone: req.body.phone ? req.body.phone : user.phone,
          },
          { where: { id: req.decoded.id } }
        );
        return res.json({
          code: 204,
          message: "Update Success",
        });
      } catch (err) {
        console.log(err);
        return res.json({
          code: 400,
          message: "Update Failed",
          error: err,
        });
      }
    } else
      return res.json({
        code: 400,
        message: "No User",
      });
  } catch (err) {
    console.log(err);
    return res.json({
      code: 404,
      message: "Not Found",
      error: err,
    });
  }
};
// exports.acceptUser = async (req, res) => {
//   try {
//   } catch (err) {}
// };
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (user) {
      if (user.id === req.decoded.id) {
        try {
          await User.destroy({
            where: {
              id: req.decoded.id,
            },
          });
          return res.json({
            code: 204,
            mesaage: "Delete Success",
          });
        } catch (err) {
          return res.json({
            code: 404,
            message: "Delete Failed",
            error: err,
          });
        }
      } else {
        return res.json({
          code: 403,
          message: "Forbidden",
        });
      }
    } else {
      return res.json({
        code: 400,
        message: "No User",
      });
    }
  } catch (err) {
    return res.json({
      code: 404,
      message: "Failed",
    });
  }
};
// 사용자 인증시 카카오 로그인으로 OAuth 사용
// 프론트가 구현될 때까지 작동 여부를 판단하기 힘듬
exports.acceptUser = async (req, res) => {
  try {
    passport.authenticate("kakao", (authError, user, info) => {
      if (authError) {
        // 인증 에러
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        // 입력된 user가 없으면
        return res.json({
          code: 404,
          message: "No User",
        });
      }
      // user가 있으면 리턴
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.json({
          code: 200,
          message: "User Accepted Success",
        });
      });
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 404,
      message: "Not Found",
    });
  }
};
