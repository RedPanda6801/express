const loginDiv = document.getElementById("login");
const joinDiv = document.getElementById("join");
const loginBtn = document.getElementById("loginBtn");
const joinBtn = document.getElementById("joinBtn");
const loginForm = document.getElementById("loginForm");
const joinForm = document.getElementById("joinForm");
const mainDiv = document.getElementById("mainDiv");
const postDiv = document.getElementById("postDiv");
const nickText = document.getElementById("userNickText");

const getUser = async (req, res) => {
  const user = await axios.get("http://localhost:8001/user");
};

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
  console.log(login.data);
  if (login.data.code == 200) {
    alert("정상적으로 로그인 되었습니다.");
    postDiv.style.display = "flex";
    mainDiv.style.display = "none";
    let userInfoText = `안녕하세요, ${login.data.user.nick}님`;
    nickText.innerText =
      login.data.user.password && login.data.user.name
        ? userInfoText
        : userInfoText + "\n본인 인증을 해주세요!";
  } else if (login.data.code == 400) {
    alert("로그인에 실패했습니다. 다시 로그인해주세요.");
  }
});
