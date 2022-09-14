const loginDiv = document.getElementById("login");
const joinDiv = document.getElementById("join");
const loginBtn = document.getElementById("loginBtn");
const joinBtn = document.getElementById("joinBtn");
const loginForm = document.getElementById("loginForm");
const joinForm = document.getElementById("joinForm");

loginBtn.addEventListener("click", () => {
  joinDiv.style.display = "none";
  loginDiv.style.display = "flex";
});
joinBtn.addEventListener("click", () => {
  joinDiv.style.display = "flex";
  loginDiv.style.display = "none";
});
joinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputArr = e.target;
  const email = inputArr[0].value;
  const password = inputArr[1].value;
  const nick = inputArr[2].value;
  const doJoin = await axios.post("http://localhost:8001/auth/join", {
    email,
    password,
    nick,
  });
  console.log(doJoin.data);
  if (doJoin.data.code == 200) {
    alert("회원가입에 성공하였습니다.");
  } else if (doJoin.data.code == 401) {
    alert("이미 존재하는 아이디입니다.");
  } else {
    alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
  }
});
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputArr = e.target;
  const email = inputArr[0].value;
  const password = inputArr[1].value;
  const login = await axios.post("http://localhost:8001/auth/login", {
    email,
    password,
  });
  console.log(login);
  if (login.data.code == 200) {
    alert("정상적으로 로그인 되었습니다.");
    window.location.href = "/post";
  }
});
