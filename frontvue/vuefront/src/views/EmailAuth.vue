<template>
  <div class="backDiv">
    <div id="formDiv">
      <div v-show="!isSendEmail">
        <ValidationObserver
          rel="authForm"
          v-slot="{ handleSubmit, invalid, validate }"
        >
          <form @submit.prevent="handleSubmit(sendEmail)">
            <div class="header">
              <p>
                당근마켓 계정으로 사용할<br />
                이메일 주소를 입력해 주세요.
              </p>
            </div>
            <div class="inputControl">
              <ValidationProvider name="이메일아이디" rules="required">
                <v-text-field
                  v-model="emailId"
                  :counter="30"
                  placeholder="아이디 입력"
                  required
                ></v-text-field>
              </ValidationProvider>
              <h5>@</h5>
              <ValidationProvider
                name="이메일_provider"
                rules="required-select"
              >
                <!-- 이메일선택지 -->
                <template>
                  <div>
                    <b-form-select
                      v-model="emailProvider"
                      :options="options"
                    ></b-form-select>
                  </div>
                </template>
              </ValidationProvider>
            </div>
            <ValidationProvider>
              <v-btn
                name="이메일_발송"
                id="submitBtn"
                type="submit"
                :disabled="invalid || !validate"
                outlined
                ><span style="color: white"> 이메일 발송 </span>
              </v-btn>
            </ValidationProvider>
          </form>
          <div class="explain">
            <p>
              - 입력하신 이메일 주소로 인증코드가 발송됩니다.<br />
              - 인증메일을 받을 수 있도록 자주 쓰는 이메일 주소를 입력해 주세요.
              <br />
              - 인증받으신 이메일은 당근마켓 계정 아이디로 활용됩니다.
            </p>
          </div>
        </ValidationObserver>
      </div>
      <div v-show="isSendEmail">
        <ValidationObserver
          rel="authForm"
          v-slot="{ handleSubmit, invalid, validate }"
        >
          <form @submit.prevent="handleSubmit(authCode)">
            <div class="header">
              <p>
                이메일로 발송된<br />
                인증코드를 입력해 주세요.
              </p>
            </div>
            <ValidationProvider
              name="인증코드"
              rules="required"
              v-slot="{ errors }"
            >
              <v-otp-input
                v-model="inputCode"
                length="6"
                type="text"
                :error-messages="errors"
              ></v-otp-input>
            </ValidationProvider>
            <ValidationProvider>
              <v-btn
                name="코드인증"
                id="submitBtn"
                type="submit"
                :disabled="invalid || !validate"
                outlined
                ><span style="color: white"> 코드 인증</span>
              </v-btn>
            </ValidationProvider>
          </form>
        </ValidationObserver>
        <!-- 여기에 버튼 하나 더 만들어서 인증번호 재발송 / 다른 이메일로 인증 기능 넣을 모달 띄울 기능 추가 -->
        <div class="btnOrganizer">
          <v-btn small text class="modalBtn" @click="openAuthModal"
            ><span style="color: grey">인증메일을 받지 못하셨나요?</span></v-btn
          >
        </div>
      </div>
      <v-divider></v-divider>
      <div>
        <v-btn
          text
          type="submit"
          style="color: #f76706"
          class="joinBtn"
          @click="back"
          >로그인 창으로 돌아가기</v-btn
        >
      </div>
    </div>
    <div data-app>
      <!-- **newCode 그냥 다시 emit으로 authCode 실행하면 될 줄 알았으나 이메일이 null값으로 담김
      이걸 다시 처리해줄 방법은 생각해보고 추후 개선하겠습니다 -->
      <AuthModal
        :openDialog="statusModal"
        v-on:closeDialog="closeAuthModal"
        v-on:newCode="sendEmail"
        v-on:newEmail="isSendEmail = false"
      ></AuthModal>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Validate from "@/assets/mixins/Validate.vue";
import AuthModal from "@/components/modal/EmailAuthModal.vue";
export default {
  name: "EmailAuth",
  components: {
    AuthModal,
  },
  mixins: [Validate],
  data: () => ({
    emailId: "",
    emailProvider: null,
    tempEmail: "",
    isSendEmail: false,
    inputCode: "",
    statusModal: false,
    options: [
      { value: null, text: "도메인입력" },
      { value: "gmail", text: "gmail.com" },
      { value: "naver", text: "naver.com" },
      { value: "daum", text: "daum.net" },
      { value: "kakao", text: "kakao.com" },
    ],
  }),
  methods: {
    authCode() {
      const user = JSON.parse(localStorage.getItem("auth"));
      console.log(user);
      axios
        .post(process.env.VUE_APP_URL + "/auth/process-code", {
          email: `${user.emailId}@${user.emailProvider}.com`,
          code: this.inputCode,
          hash: user.hash,
          provider: user.emailProvider,
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
      const email =
        this.emailProvider === "daum"
          ? `${this.emailId}@daum.net`
          : `${this.emailId}@${this.emailProvider}.com`;
      this.tempEmail = email;
      alert(`"${email}" 이메일을 발송하였습니다.`);
      axios
        .get(process.env.VUE_APP_URL + `/auth/send-email/${email}`)
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
    back() {
      localStorage.removeItem("auth");
      this.$router.push({ path: "/login" });
    },
    openAuthModal() {
      this.statusModal = true;
      console.log("-- open : ", this.statusModal);
    },
    closeAuthModal() {
      this.statusModal = false;
      console.log("-- close : ", this.statusModal);
    },
  },
  // resendEmail, reAuth는 기존에 있는 코드와 변수값 변경으로 대체함. Component에서 확인 요망.
};
</script>
<style lang="css">
.backDiv {
  padding: 10% 30% 0% 30%;
}
.header {
  padding: 10%;
  text-align: center;
  color: #f76706;
  font-size: 20px;
}
.inputControl {
  display: grid;
  grid-template-columns: 55% 5% 40%;
  grid-gap: 1%;
  justify-content: center;
  align-items: center;
}
.explain {
  margin-top: 80px;
  color: grey;
  font-size: 10px;
}
.joinBtn {
  margin-top: 20px;
  color: grey;
}
.joinBtn:hover {
  background-color: #eee;
}
</style>
