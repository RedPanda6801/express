// 유저 정보 조회
// 카카오 로그인으로 사용자 인증
// 유저 정보 수정
// 유저 탈퇴
const express = require("express");
const {
  verifyToken,
  apiLimiter,
  isLoggedIn,
  isNotLoggedIn,
} = require("../routes/middleware");
const User = require("../models/user");
const { Follow, Post } = require("../models");

// exports.getUser = async (req, res) => {
//   try {
//   } catch (err) {}
// };
// exports.updateUser = async (req, res) => {
//   try {
//   } catch (err) {}
// };
// exports.acceptUser = async (req, res) => {
//   try {
//   } catch (err) {}
// };
// exports.updateUser = async (req, res) => {
//   try {
//   } catch (err) {}
// };
