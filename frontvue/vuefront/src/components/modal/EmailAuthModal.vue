<template>
  <v-dialog persistent width="400" v-model="dialog">
    <div style="height: 300px; background-color: white">
      <div class="modalHeader">
        <v-spacer></v-spacer>
        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div style="padding: 30px">
        <h5>인증메일을 받지 못하셨나요?</h5>
        <div class="msg">
          이메일 주소가 정확한지 확인해 주세요. <br />
          메일 서비스에 따라 인증번호 발송이 늦어질 수 있습니다.
        </div>
        <div class="organizer">
          <v-btn
            text
            name="코드인증"
            style="color: #f76706"
            type="submit"
            class="modalBtn"
            @click="newCode"
            >인증번호 재발송
          </v-btn>
          <v-btn text type="submit" class="modalBtn" @click="newEmail"
            >다른 이메일로 인증
          </v-btn>
        </div>
      </div>
    </div>
    <!-- <v-card class="modal">
      <div class="modalHeader">
        <h5>인증메일을 받지 못하셨나요??</h5>
        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <v-card-text>
        <p>모달테스트</p>
        <v-btn>인증코드 재발송</v-btn>
      </v-card-text>
    </v-card> -->
  </v-dialog>
</template>
<script>
export default {
  name: "AuthModal",
  props: {
    openDialog: Boolean,
  },
  computed: {
    dialog(props) {
      console.log(props.openDialog);
      return props.openDialog;
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeDialog");
    },
    newCode() {
      this.$emit("newCode");
      this.$emit("closeDialog");
    },
    newEmail() {
      this.$emit("newEmail");
      this.$emit("closeDialog");
    },
  },
};
</script>
<style>
.modal {
  box-sizing: border-box;
  display: flex;
  padding: 30px;
}
.modalHeader {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.formStyle {
  margin: 20px auto 0px auto;
}
.msg {
  color: grey;
  font-size: 13px;
  margin-top: 10px;
}
.modalBtn {
  width: 100%;
}
.organizer {
  margin-top: 40px;
}
</style>
