<template>
  <v-app>
    <v-app-bar app clipped-left flat class="orange lighten-2">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title
        ><div>
          <router-link id="homeBtn" to="/">당근 마켓</router-link>
        </div></v-app-bar-title
      >
      <v-text-field
        label="Search"
        filled
        style="margin: 5% 1% 3% 20%"
      ></v-text-field>
      <v-btn
        class="orange lighten-3"
        style="margin-right: 20%; height: 95%; width: 5%"
        >Search</v-btn
      >
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn elevation="2" fab v-on="on" v-bind="attrs"></v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="clickMenu(item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      app
      clipped
      class="orange lighten-3"
      v-model="drawer"
    ></v-navigation-drawer>
  </v-app>
</template>
<script>
export default {
  name: "NavBar",
  data: () => ({
    drawer: false,
    items: [{ title: "Login" }, { title: "Logout" }],
  }),
  methods: {
    async clickMenu(value) {
      if (value == "Login") {
        if (!localStorage.getItem("token")) {
          // 토큰 유효시간에 대헤 쿠키에서 확인해야함!!!!(중요)
          console.log("loginPage");
          this.$router.push({ path: "/login" });
        } else {
          alert("로그인이 되어있습니다.");
        }
      } else if (value == "Logout") {
        if (localStorage.getItem("user")) {
          if (confirm("정말로 로그아웃 하시겠습니까?")) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            alert("로그아웃 성공");
            this.$router.go(0);
          }
        } else {
          alert("로그인을 하세요");
        }
      }
    },
  },
};
</script>
<style lang="css">
body,
html {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: rgb(235, 162, 89);
}
</style>
