import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import active from './views/nav1/active.vue'
import floor from './views/nav1/floor.vue'
import state from './views/nav1/state.vue'
import activeMaterial from './views/nav2/activeMaterial.vue'
import screenMaterial from './views/nav2/screenMaterial.vue'
import firstPage from './views/nav2/firstPage'
import shopManagement from './views/nav3/shopManagement.vue'
import screenManagement from './views/nav4/screenManagement.vue'
import map from './views/nav5/map.vue'
import account from './views/nav6/account.vue'
import shopCount from './views/nav7/shopCount.vue'
import terminalCount from './views/nav7/terminalCount.vue'
import terminalManagement from './views/nav8/terminalManagement.vue'
import role from './views/nav6/role.vue'

import route from './route.js'

let routes = [{
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: {
            path: '/404'
        }
    }
];

let hiddenList = JSON.parse(window.localStorage.getItem("role"));

hideMenu(route, hiddenList);
function hideMenu(menus, hiddenList) {
if(!hiddenList||!menus){
    return
}else{
    for (let i = 0, len = hiddenList.length; i < len; i++) {
        for (let j = 0, len2 = menus.length; j < len2; j++) {
            let menu = menus[j];
            if (menu.systemCode === hiddenList[i]) {
                menu.hidden = true;
            } else {
                if(menu.children){
                    hideMenu(menu.children, hiddenList);
                }
            }
        }
    }
}}

for (let i = 0; i < route.length; i++) {
    routes.push(route[i])
    
}





export default routes;