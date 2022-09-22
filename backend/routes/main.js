const express = require("express");
const path = require("path");
const router = express();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/main.html"));
});

module.exports = router;
