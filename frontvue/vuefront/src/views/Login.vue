<template lang="ko">
<div class="backDiv">
    <div id="formDiv">
      <ValidationObserver rel="signInForm" v-slot="{handleSubmit, invalid, validate}">
      <form @submit.prevent="handleSubmit(signIn)">
<h1>당근 마을</h1><br/>
          <h4>마을 둘러보기</h4>
          <ValidationProvider
        name="이메일" rules="required|email" v-slot="{errors}">
          <v-text-field
            v-model="email"
            :counter="50"
            :error-messages="errors"
            prepend-inner-icon="mdi-account"
            label="이메일 입력"
            required
          ></v-text-field> 
          </ValidationProvider>
          <ValidationProvider
          name="비밀번호" rules="required|min:6" v-slot="{errors}">
          <v-text-field
            v-model="password"
            :counter="13"
            :error-messages="errors"
            prepend-inner-icon="mdi-lock"
            label="암구호 입력"
            required
          ></v-text-field> 
          </ValidationProvider>
          <v-btn
          id="submitBtn"
          class="mr-4"
          type="submit"
          :disabled="invalid || !validate"
        >입장하기
        </v-btn>
        </ValidationProvider>

        <v-btn
          class="mr-4"
          type="submit"
          href="/join"
        >가입하기
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
  background-color: #ffb74d;
}
#submitBtn {
  margin-right: 10%;
}
.backDiv {
  padding: 10% 30% 0% 30%;
}
</style>
