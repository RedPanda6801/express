const express = require("express");
const path = require("path");
const app = express();
const logger = require("morgan");
const mainRouter = require("./routes");
const postRouter = require("./routes/post");

app.use(logger("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", mainRouter);
app.use("/post", postRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.log(err);
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.json({
    code: 500,
    message: "서버 오류",
  });
});
app.listen(4000);
