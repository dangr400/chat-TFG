import { createWebHistory, createRouter } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
// lazy-loaded
const Profile = () => import("./views/Profile.vue")
const PageNotFound = () => import("./views/PageNotFound.vue")
const Comms = () => import("./views/Comms.vue")

const routes = [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/comms",
    name: "contactos-y-grupos",
    component: Comms,
  },
  {
    path: "/chat/:salaId",
    name: "chat",
    component: () => import("./views/Chat.vue")
  },
  {
    path: "/grupos/nuevo",
    component: () => import("./components/NuevoGrupo")
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: '/:pathMatch(.*)*',
    name: "404",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;