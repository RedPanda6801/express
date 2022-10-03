<template lang="ko">
  <div class="backDiv">
    <div id="formDiv">
      <ValidationObserver ref="signUpForm"
              v-slot="{ handleSubmit, invalid, validate }">
              <form @submit.prevent="handleSubmit(signUp)">
          <h1>당근 마을</h1><br/>
        <h4>주민 등록하기</h4>
        <ValidationProvider
                  name="별명"
                  rules="required"
                  v-slot="{ errors }"
        <v-text-field
          v-model="nick"
          :counter="10"
          :error-messages="errors"
          prepend-inner-icon="mdi-account"
          label="Nickname"
          required
        ></v-text-field> 
        </ValidationProvider>
        <!-- 이메일 인증 시에 localStorage에 값이 있기 때문에 입력할 필요 없음 -->
        <ValidationProvider
                  name="이메일"
                  rules="required|email"
                  v-slot="{ errors }">
        <v-text-field
          v-model="email"
          :counter="50"
          :error-messages="errors"
          prepend-inner-icon="mdi-account"
          label="email"
          required
          disabled
        ></v-text-field> 
        </ValidationProvider>
        <ValidationProvider
                  name="비밀번호"
                  rules="required|min:6"
                  v-slot="{ errors }">
        <v-text-field
          v-model="password"
          :counter="13"
          :error-messages="errors"
          prepend-inner-icon="mdi-lock"
          label="password"
          required
        ></v-text-field>
        </ValidationProvider>
        <ValidationProvider
                  name="비밀번호 확인"
                  rules="required|confirmed:비밀번호"
                  v-slot="{ errors }"> 
        <v-text-field
          v-model="confirm"
          :counter="13"
          :error-messages="errors"
          prepend-inner-icon="mdi-lock"
          label="CheckPassword"
          required
        ></v-text-field> 
        </ValidationProvider>
        <v-btn
          @click="signUp"
          depressed
          right
          color="primary"
          class="blue"
          type="submit"
          :disabled="invalid || !validate"
      >submit
      </v-btn>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Validate from "@/assets/mixins/Validate.vue";
export default {
  mixins: [Validate],
  data: () => ({
    nick: "",
    confirm: "",
    email: "",
    password: "",
    drawer: false,
    loading: "",
    channel: "",
  }),
  methods: {
    // 회원가입
    async signUp() {
      console.log(process.env);
      if (this.loading) return;
      this.loading = true;
      const axiosBody = {
        email: this.email,
        nick: this.nick,
        password: this.password,
      };
      console.log("auth/register - axiosBody : ", axiosBody);
      await axios
        .post(process.env.VUE_APP_URL + "/auth/join", axiosBody)
        // 서버에 회원가입 요청
        .then(async (res) => {
          const { code } = res.data; // json으로 받은 결과 값 중의 status를 저장
          console.log("auth/register - response: ", code);
          if (code == 401) {
            alert("존재하는 이메일입니다. 다시 입력해주세요!");
          } else if (code == 200) {
            alert("마을에 등록되었습니다. 행복한 하루 되세요!");
            // localStorage에 값을 저장
            this.$router.push({ path: "/login" });
            // router로 화면 전환
          } else {
            alert("등록에 실패하였습니다. 다시 시도해주세요...");
            this.$router.go(0);
            // 화면 다시 보여주기
          }
        })
        .catch((err) => {
          alert("마을에 문제가 생겼어요! 해결할때까지 기다려주세요!");
          console.log(err);
        });
    },
    // 화면 전환 시에 이메일 인증 여부를 확인해주는 코드
    checkAuth() {
      if (!localStorage.getItem("email")) {
        alert("이메일 인증을 먼저 해주세요!");
        this.$router.push("/auth-email");
      } else {
        // 이메일이 있으면 Input에 넣어줌
        this.email = localStorage.getItem("email");
      }
    },
  },
  mounted() {
    // this.checkAuth();
  },
};
</script>
<style lang="css">
.backDiv {
  padding: 10% 30% 0% 30%;
}
</style>
