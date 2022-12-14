import Vue from "vue";
import VueRouter from "vue-router";
import Nav from "@/components/Nav.vue";
import Login from "@/views/Login.vue";
import Join from "@/views/Join.vue";
import EmailAuth from "@/views/EmailAuth.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Nav,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/join",
    name: "Join",
    component: Join,
  },
  {
    path: "/auth-email",
    name: "EmailAuth",
    component: EmailAuth,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
