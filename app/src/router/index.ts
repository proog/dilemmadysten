import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import HostView from "../views/HostView.vue";
import JoinView from "../views/JoinView.vue";
import StartView from "../views/StartView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/start",
      component: StartView,
      children: [
        {
          path: "",
          redirect: "host",
        },
        {
          path: "/join",
          name: "join",
          component: JoinView,
        },
        {
          path: "/host",
          name: "host",
          component: HostView,
        },
      ],
    },
  ],
});

export default router;
