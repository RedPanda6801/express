const express = require("express");
const router = express();
const path = require("path");

router.get("/", (req, res) => {
  console.log("hello");
  res.sendFile(path.join(__dirname, "../views/post.html"));
});

module.exports = router;
