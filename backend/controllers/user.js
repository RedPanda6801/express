const passport = require("passport");
const { Follow, Post, User } = require("../models");

// 사용자 정보 조회
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
      return res.status(200).json({
        user: result,
      });
    } else {
      // 유저를 찾지 못했다면
      return res.status(400).json({
        message: "No User",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

// 사용자 정보 수정 API
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
            nick: req.body.nick ? req.body.nick : user.nick,
            phone: req.body.phone ? req.body.phone : user.phone,
          },
          { where: { id: req.decoded.id } }
        );
        return res.status(200).json({
          message: "Update Success",
        });
      } catch (error) {
        console.log(error);
        return res.status(404).json({
          message: "Update Failed",
        });
      }
    } else
      return res.status(400).json({
        message: "No User",
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
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
          return res.status(200).json({
            mesaage: "Delete Success",
          });
        } catch (error) {
          console.log(error);
          return res.status(404).json({
            message: "Delete Failed",
          });
        }
      } else {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
    } else {
      return res.status(400).json({
        message: "No User",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
