import Main from "./components/mainAbout/Main";
import Login from "./pages/Login";
import Regist from "./pages/Regist";
import Forget from "./pages/Forget";
import Activity from "./pages/Activity";
import User from "./pages/User";
import DetailPost from "./components/postAbout/DetailPost";

export const routerMap = [
    {path:'/', name:'main', component: Main, needRout:true},
    {path:'/login', name:'login', component: Login},
    {path:'/regist', name:'regist', component: Regist},
    {path:'/forget', name:'forget', component: Forget},
    {path:'/activity', name:'activity', component: Activity},
    {path:'/user', name:'user', component: User, auth:true},
    {path:'/detailPost', name:'detailPost', component: DetailPost}
]
