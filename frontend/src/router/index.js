import { createRouter, createWebHistory } from "vue-router";
import Navbar from "../components/Navbar.vue";
import Signup from "../components/Signup.vue";
import CreatePost from "../pages/CreatePost.vue";
import PostPage from "../pages/PostPage.vue";
import Dashboard from "../pages/Dasheboard.vue";
import EditPost from "../pages/EditPost.vue";
import Blog from "../pages/Blog.vue";
import PostDetail from "../pages/PostDetail.vue";
import HomePage from "../pages/HomePage.vue";
import Ourstorypage from "../pages/Ourstorypage.vue";
const routes = [
  {
    path: "/homepage",
    name: "homepage",
    component: HomePage,
  },
  {
    path: "/ourstory",
    name: "ourstory",
    component: Ourstorypage,
  },
  // {
  //   path: "/Navbar",
  //   name: "Navbar",
  //   component: Navbar,
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/",
    redirect: "/homepage",
  },
  {
    path: "/blogs",
    name: "Blog",
    component: Blog,
  },
  {
    path: "/post/:postId",
    name: "PostDetail",
    component: PostDetail,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: { requiresGuest: true },
  },
  {
    path: "/create-post",
    name: "CreatePost",
    component: CreatePost,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-post/:blogId",
    name: "EditPost",
    component: EditPost,
    meta: { requiresAuth: true },
  },
  {
    path: "/posts/:id",
    name: "PostPage",
    component: PostPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
   const token = localStorage.getItem("token");
   if (to.meta.requiresAuth && !token) {
     next("/signup"); // redirect to login if no token
   } else {
     next(); 
   }
});

export default router;
