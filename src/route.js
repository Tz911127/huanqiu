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

 let route = [
    {
        path: '/',
        component: Home,
        name: '基础管理',
        systemCode:"MENU_BaseManage",
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/state', component: state,systemCode:"MENU_BizFomatData", name: '业态数据' },
            { path: '/floor', component: floor,systemCode:"MENU_FloorManage", name: '楼层数据' },
            { path: '/active', component: active,systemCode:"MENU_ActivityData", name: '活动数据' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商铺管理',
        iconCls: 'el-icon-share',
        leaf: true,
        systemCode:"MENU_ShopManage",
        children: [
            { path: '/shopManagement', component: shopManagement, name: '商铺管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '素材管理',
        iconCls: 'el-icon-setting',
        systemCode:"MENU_MaterialManage",
		// hidden: true,
        children: [
            { path: '/activeMaterial', component: activeMaterial,systemCode:"MENU_ActivityMaterial", name: '活动素材' },
            { path: '/screenMaterial', component: screenMaterial,systemCode:"MENU_ScreensaverMaterial", name: '屏保素材' },
            { path:'/firstPage',component:firstPage,systemCode:"MENU_FirstPageCarousel",name:'首页轮播'}
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '屏保管理',
        iconCls: 'el-icon-menu',
        systemCode:"MENU_ScreensaverManage",
        leaf: true,        
        children: [
            { path: '/screenManagement', component: screenManagement,systemCode:"MENU_ScreensaverManage", name: '屏保管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '终端管理',
        leaf: true,
        systemCode:"MENU_TerminalManage",
        iconCls: 'el-icon-edit',
        children: [
            { path: '/terminalManagement', component: terminalManagement,systemCode:"MENU_TerminalManage", name: '终端管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '地图管理',
        iconCls: 'el-icon-info',
        leaf: true,
        systemCode:"MENU_MapManage",
        // hidden:true,
        children: [
            { path: '/map', component: map,systemCode:"MENU_MapManage", name: '地图管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        // leaf: true,        
        iconCls: 'el-icon-search',
        systemCode:"MENU_SystemManage",
        children: [
            { path: '/account', component: account,systemCode:"MENU_AccountManage", name: '账号管理' }, 
            { path: '/role', component: role,systemCode:"MENU_RoleManage", name: '角色管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计分析',
        iconCls: 'el-icon-document',
        systemCode:"MENU_SystemAnalysis",
        children: [
            { path: '/shopCount', component: shopCount,systemCode:"MENU_ShopVisitCount", name: '商铺访问统计' },
            { path: '/terminalCount', component: terminalCount,systemCode:"MENU_TerminalVisitCount", name: '终端访问统计' }
        ]
    },
]

export default route;