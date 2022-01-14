// import { RequestConfig } from 'umi';
import axios from 'axios';

export async function getInitialState() {
    console.log('app.ts');
    appInit();
    const permissions = {};//''await fetchUserPermissions()
    // return { permissions }
    return permissions
}

const appInit = () => {
    if (window.MobWeb && window.MobWeb.initFlag && window.MobWeb.initFlag) return;
    window.MobWeb.initFlag = true;
    console.error('appInit');
    axios.defaults.baseURL = window.MobWeb.baseUrl;
    // axios.defaults.headers.head['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    // axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';//application/x-www-form-urlencoded
    // console.log(axios.defaults);

    // axios.interceptors.request.use(function (config) {
    //     // 在发送请求之前做些什么
    //     console.error(config);
    //     return config;
    // }, function (error) {
    //     // 对请求错误做些什么
    //     console.error('error',error);
    //     return Promise.reject(error);
    // });
}

// export const request: RequestConfig = {
//     timeout: 5000,
//     errorConfig: {},
//     middlewares: [],
//     requestInterceptors: [],
//     responseInterceptors: [],
// };


// export const layout = () => {
//     return {
//         menuDataRender: () => [ //此功能可以实现动态路由，用来渲染访问路由
//             // {
//             //     path: '/',
//             //     name: 'Home',
//             // },
//             {
//                 path: '/',
//                 component: '@/pages/login',
//                 access: 'canReadPageA',
//                 // hideInMenu:true
//             },
//             {
//                 path: '/about',
//                 name: 'About',
//                 children: [
//                     { path: '/about/company', name: 'Company' },
//                     { path: '/about/investors', name: 'Investors' },
//                 ],
//             },
//         ],
//     }
// };
