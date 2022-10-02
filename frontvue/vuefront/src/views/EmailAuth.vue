<template>
  <div>
    <ValidationObserver rel="signInForm" v-slot="{ invalid, validate }">
      <form>
        <h1>이메일 인증</h1>
        <VaildationProvider name="이메일" rules="required|email">
          <v-text-field
            v-model="email"
            placeholder="이메일 입력"
          ></v-text-field>
        </VaildationProvider>
        <ValidationProvider
          name="이메일_발송"
          id="submitBtn"
          type="submit"
          :disabled="invalid || !validate"
          outlined
        >
          <v-btn @click="sendEmail"> 이메일 발송 </v-btn>
        </ValidationProvider>
      </form>
      <ValidationProvider>
        <v-text-field
          v-show="isSendEmail"
          v-model="inputCode"
          placeholder="인증 코드 입력"
        ></v-text-field>
      </ValidationProvider>
      <ValidationProvider>
        <ValidationProvider
          v-show="isSendEmail"
          name="코드인증"
          id="submitBtn"
          type="submit"
          :disabled="invalid || !validate"
          outlined
        >
          <v-btn @click="authCode"> 코드 인증</v-btn>
        </ValidationProvider>
      </ValidationProvider>
    </ValidationObserver>
  </div>
</template>
<script>
import axios from "axios";
import Validate from "@/assets/mixins/Validate.vue";
export default {
  name: "EmailAuth",
  mixins: [Validate],
  data: () => ({
    email: "",
    isSendEmail: false,
    inputCode: "",
  }),
  methods: {
    authCode() {
      const user = JSON.parse(localStorage.getItem("auth"));
      console.log(user);
      axios
        .post(process.env.VUE_APP_URL + "/auth/process-code", {
          email: user.email,
          code: this.inputCode,
          hash: user.hash,
        })
        .then((response) => {
          console.log("인증 성공 : ", response);
          alert("이메일 인증에 성공하셨습니다. 회원가입 페이지로 넘어갑니다.");
          localStorage.setItem("email", user.email);
          localStorage.removeItem("auth");
          this.$router.push("/join");
        })
        .catch((error) => {
          console.log("인증 실패 : ", error);
        });
    },
    sendEmail() {
      // Validation 사용 방법을 몰라 자체적으로 유효성 검사 코드를 만들었습니다. HTML쪽 확인하시고 수정 부탁드립니다.
      const emailArr = this.email.split("@");
      if (emailArr.length !== 2) {
        alert("이메일 입력이 잘못되었습니다. (@입력 X)");
        return;
      } else if (emailArr[1].split(".").length === 1) {
        alert("도메인 입력이 잘못되었습니다. (.입력 X");
        return;
      }
      // Validation 사용이 가능해지면 이 코드는 삭제하셔도 괜찮습니다.
      alert(`"${this.email}" 이메일을 발송하였습니다.`);
      axios
        .get(process.env.VUE_APP_URL + `/auth/send-email/${this.email}`)
        .then((response) => {
          console.log("이메일 발송 성공 : ", response);
          if (localStorage.getItem("auth")) {
            localStorage.removeItem("auth");
          }
          this.isSendEmail = true;
          localStorage.setItem("auth", JSON.stringify(response.data.user));
        })
        .catch((error) => {
          console.log("이메일 발송 실패 : ", error);
        });
    },
  },
};
</script>
<style lang="css"></style>
