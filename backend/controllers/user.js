// 유저 정보 조회 (O)
// 카카오 로그인으로 사용자 인증
// 유저 정보 수정 (O)
// 유저 탈퇴
const express = require("express");
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
// exports.updateUser = async (req, res) => {
//   try {
//   } catch (err) {}
// };