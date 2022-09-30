<template>
  <!-- 배경 정리되면 내브바 흰색으로 -->
  <div>
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="#" class="navDefault">
        <img
          src="../assets/navIcon.png"
          class="d-inline-block align-top"
          height="40"
          alt="Logo"
        />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav> -->

        <!-- Right aligned nav items -->
        <v-spacer></v-spacer>
        <!-- if문 걸어서 로그인 시 로그인버튼 없애고 유저 용 버튼 띄울거임 -->
        <b-button variant="outline-warning" class="loginBtn" @click="logIn"
          >로그인</b-button
        >
        <b-form class="d-flex">
          <b-form-input placeholder="Search" class="d-flex"></b-form-input>
          <b-button class="d-flex" variant="outline" type="submit"
            ><b-icon icon="search" color="#f76706"></b-icon
          ></b-button>
        </b-form>
        <!-- 
        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <!-- <b-nav-item-dropdown right>

          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown> -->
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Nav",
  methods: {
    logIn() {
      if (!localStorage.getItem("token")) {
        // 토큰 유효시간에 대헤 쿠키에서 확인해야함!!!!(중요)
        console.log("loginPage");
        this.$router.push({ path: "/login" });
      } else {
        alert("로그인이 되어있습니다.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navDefault {
  color: #f76706;
}
.loginBtn {
  margin-right: 20px;
}
.searchBtn {
  display: inline;
}
</style>
