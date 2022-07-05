import { createRouter,createWebHashHistory,RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path:'/',
        redirect:'/student'
    },
    {
        path:'/student',
        name:'Student',
        component:() => import('@/views/student/index.vue'),
        meta:{title:'学生列表'}        
    },
    {
        path:'/student/add',
        name:'StudentAdd',
        component:() => import("@/views/student/add.vue"),
        meta:{title:'添加学生'}
    }
]

export default createRouter({
    history:createWebHashHistory(),
    routes
})