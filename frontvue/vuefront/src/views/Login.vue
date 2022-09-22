<template lang="ko">
<div>
  <!-- <div class="container"> -->
    <div id="formDiv">
      <ValidationObserver rel="signInForm" v-slot="{handleSubmit, invalid, validate}">
      <form @submit.prevent="handleSubmit(signIn)">
          <div class="container">    
          <img alt="SiteLogo" src="../assets/icon.png" class="icon"></img>
          <!-- <br/>
          <h4>마을 둘러보기</h4> -->
          </div>
          <ValidationProvider
        name="이메일" rules="required|email" v-slot="{errors}">
          <v-text-field 
            v-model="email"
            style="color: #f76706"
            :counter="50"
            :error-messages="errors"
            prepend-inner-icon="mdi-account"
            label="이메일 입력"
            required
          ><v-icon>mdi-account</v-icon></v-text-field> 
          </ValidationProvider>
          <ValidationProvider
          name="비밀번호" rules="required|min:6" v-slot="{errors}">
          <v-text-field
            v-model="password"
            style="color: #f76706"
            :counter="13"
            :error-messages="errors"
            prepend-inner-icon="mdi-lock"
            label="비밀번호 입력"
            required
          ><v-icon>mdi-lock</v-icon></v-text-field> 
          </ValidationProvider>
          <ValidationProvider>
          <v-btn
          id="submitBtn"
          type="submit"
          :disabled="invalid || !validate"
          outlined
        ><span style="color: white">입장하기</span>
        </v-btn>
        </ValidationProvider>
        </form>
      </ValidationObserver>
      <div class="btnOrganizer">
        <v-btn
          text
          type="submit"
          href="/join"
          style="color: #f76706"
          class="joinBtn">
          가입하기
        </v-btn>
        <v-btn
          text
          type="submit"
          href="#"
          style="color: #f76706"
          class="joinBtn">
          아이디 찾기
        </v-btn>
        <v-btn
          text
          type="submit"
          href="#"
          style="color: #f76706"
          class="joinBtn">
          비밀번호 찾기
        </v-btn>
        </div>
    </div>
</div>
</template>
<script>
import axios from "axios";
import Validate from "@/assets/mixins/Validate.vue";
export default {
  mixins: [Validate],
  data: () => ({
    name: "SignIn",
    drawer: false,
    email: "",
    password: "",
  }),
  methods: {
    async signIn() {
      if (this.loading) return;
      this.loading = true;
      const axiosBody = {
        email: this.email,
        password: this.password,
      };
      console.log("auth/login - axiosBody : ", axiosBody);
      console.log(process.env.VUE_APP_URL);
      await axios
        .post(process.env.VUE_APP_URL + "/auth/login", axiosBody)
        // 서버에 로그인을 요청함
        .then(async (response) => {
          const { code } = response.data;
          console.log("auth/login - response : ", code);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          // 로컬 스토리지에 유저 정보 저장
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          console.log("auth/login - error : ", error);
          // 에러문구 표시
          this.$refs.signInForm.setErrors({
            이메일: ["이메일을 확인해주세요."],
            비밀번호: ["비밀번호를 확인해주세요."],
          });
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="css">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #ffeccf;
}
#submitBtn {
  margin-right: 10%;
  background-color: #f76706;
  border-color: #b54c06;
  width: 100%;
  margin-top: 30px;
}
.joinBtn {
  color: orange;
}
.joinBtn:hover {
  background-color: rgb(250, 212, 141);
}
/* .backDiv {
  padding: 10% 30% 0% 30%;
} */
.icon {
  height: 80px;
  margin-bottom: 50px;
}
.container {
  display: flex;
  justify-content: center;
}
.btnOrganizer {
  display: flex;
  margin-top: 40px;
  justify-content: space-between;
}
.mdi-account::before {
  color: #b54c06;
}
.mdi-lock::before {
  color: #b54c06;
}
</style>
