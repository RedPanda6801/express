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

                <!-- 뷰티파이는 왜 작동이 안되는지 모르겠어서... 일단 부트스트랩으로 -->
                <!-- <template>
              <v-select
                v-model="email_provider"
                :items="['@gmail.com', '@naver.com', '@daum.net', '@kakao.com']"
                label="원하시는 이메일을 선택해 주세요"
              >
                <template v-slot:item="{ item, attrs, on }">
                  <v-list-item v-bind="attrs" v-on="on">
                    <v-list-item-title
                      :id="attrs['aria-labelledby']"
                      v-text="item"
                    ></v-list-item-title>
                  </v-list-item>
                </template>
              </v-select>
            </template> -->
              </ValidationProvider>
            </div>
            <ValidationProvider>
              <v-btn
                name="이메일_발송"
                id="submitBtn"
                type="submit"
                :disabled="invalid || !validate"
                outlined
                @click="sendEmail"
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
                @click="authCode"
                ><span style="color: white"> 코드 인증</span>
              </v-btn>
            </ValidationProvider>
            <!-- 여기에 버튼 하나 더 만들어서 인증번호 재발송 / 다른 이메일로 인증 기능 넣을 모달 띄울 기능 추가 -->
            <v-btn><p>인증메일을 받지 못하셨나요?</p></v-btn>
          </form>
        </ValidationObserver>
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
  </div>
</template>
<script>
import axios from "axios";
import Validate from "@/assets/mixins/Validate.vue";
export default {
  name: "EmailAuth",
  mixins: [Validate],
  data: () => ({
    emailId: "",
    emailProvider: null,
    isSendEmail: false,
    inputCode: "",
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
      // Validation 사용 방법을 몰라 자체적으로 유효성 검사 코드를 만들었습니다. HTML쪽 확인하시고 수정 부탁드립니다.
      // const emailArr = this.email.split("@");
      // if (emailArr.length !== 2) {
      //   alert("이메일 입력이 잘못되었습니다. (@입력 X)");
      //   return;
      // } else if (emailArr[1].split(".").length === 1) {
      //   alert("도메인 입력이 잘못되었습니다. (.입력 X");
      //   return;
      // }
      // Validation 사용이 가능해지면 이 코드는 삭제하셔도 괜찮습니다.
      const email =
        this.emailProvider === "daum"
          ? `${this.emailId}@daum.net`
          : `${this.emailId}@${this.emailProvider}.com`;
      alert(`"${email}" 이메일을 발송하였습니다.`);
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
    back() {
      localStorage.removeItem("auth");
      this.$router.push({ path: "/login" });
    },
  },
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
</style>
