import axios from 'axios';

// let base = 'http://192.168.1.126:9000'
let base = ''

export const ip = ()=> {return base};

export const requestLogin = params => { return axios.post(`${base}/user/login`, params)};

export const getToken = params => { return axios.get(`${base}/user/token?token=` + JSON.parse(window.localStorage.getItem('token')),params)}

export const loginOut = params => { return axios.get(`${base}/user/logout?token=` + JSON.parse(window.localStorage.getItem('token')),params)}

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

//获取列表


export const getUserListPage = params => { return axios.get(`${base}/shop/bizShops?token=` + JSON.parse(window.localStorage.getItem('token')), { params: params });};

export const getStatePage = params => { return axios.get(`${base}/bizFormat/bizFormats?token=` + JSON.parse(window.localStorage.getItem('token')), { params: params });};

export const getBusinessFormats = params => { return axios.get(`${base}/bizFormat/businessFormats?token=` + JSON.parse(window.localStorage.getItem('token')),{ params: params });}

export const getFloorPage = params => { return axios.get(`${base}/floor/bizFloors?token=` + JSON.parse(window.localStorage.getItem('token')), {params: params});};

export const getFloors = params => { return axios.get(`${base}/floor/floors?token=` + JSON.parse(window.localStorage.getItem('token')), {params: params});}

export const getActivePage = params => { return axios.get(`${base}/activity/bizActivities?token=` + JSON.parse(window.localStorage.getItem('token')), { params: params });};

export const getActiveSelect = params => { return axios.get(`${base}/activity/activities?token=` + JSON.parse(window.localStorage.getItem('token')), { params:params});}

export const getScreenPage = params => { return axios.get(`${base}/screensaverMaterial/bizScreensaverMaterials?token=` + JSON.parse(window.localStorage.getItem('token')), { params: params }); };

export const getScreenBound = params => { return axios.get(`${base}/screensaverMaterial/bizScreensaverMaterialsBound?token=` + JSON.parse(window.localStorage.getItem('token')), { params: params })}
 
export const getActiveMaterialPage = params => { return axios.get(`${base}/activityMaterial/bizActivityMaterials?token=` + JSON.parse(window.localStorage.getItem('token')), { params: params }); };

export const getScreenManagementPage = params => { return axios.get(`${base}/screensaver/bizScreensavers?token=` + JSON.parse(window.localStorage.getItem('token')), { params: params }); };

export const getSerminalManagePage = params => { return axios.get(`${base}/terminal/bizTerminals?token=` + JSON.parse(window.localStorage.getItem('token')), {params:params});}

export const getPublichScreen = params => { return axios.post(`${base}/screensaver/publishedScreensaver?token=` + JSON.parse(window.localStorage.getItem('token')), params);}

export const getScreenSaver = params => { return axios.get(`${base}/screensaver/bizScreensaver/?token=` + JSON.parse(window.localStorage.getItem('token')), {params:params})}

export const getPublic = params => { return axios.get(`${base}/terminal/bizTerminalsWithPublishedFlag?token=` + JSON.parse(window.localStorage.getItem('token')),{params:params})}

export const getMapPage = params => { return axios.get(`${base}/map/bizMaps?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params })}

export const getImg = params => { return axios.get(`${base}/terminal/bizProgram?token=` + JSON.parse(window.localStorage.getItem('token')),{params:params})}

export const getShopVisits = params => { return axios.get(`${base}/shop/visits?token=` + JSON.parse(window.localStorage.getItem('token')), {params:params})};

export const getTerminalVisits = params => { return axios.get(`${base}/terminal/visits?token` + JSON.parse(window.localStorage.getItem('token')),{ params:params})}

export const getUser = params => { return axios.get(`${base}/user/users?token=` + JSON.parse(window.localStorage.getItem('token')), {params:params})}

export const getScreenImg = params => { return axios.get(`${base}/screensaverMaterial/unbound-ScreensaverMaterials?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params})}

export const getPic = params => { return axios.get(`${base}/shop/shop`,{params:params})}

export const getFirst = params => { return axios.get(`${base}/screensaverMaterial/bizScreensaverMaterials/first?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params})}

export const getConfig = params => { return axios.get(`${base}/terminal/config?token=` + JSON.parse(window.localStorage.getItem('token')), params )}
//删除

export const removeUser = params => { return axios.delete(`${base}/shop/bizShop/status?token=`+ JSON.parse(window.localStorage.getItem('token')), { params: params }); };

export const removeState = params => { return axios.delete(`${base}/bizFormat/bizFormat/?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params});};

export const removeFloor = params => { return axios.delete(`${base}/floor/bizFloor/?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params});};

export const removeActive = params => { return axios.delete(`${base}/activity/bizActivity/?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params});};

export const removeActivepage = params => { return axios.delete(`${base}/activityMaterial/bizActivityMaterial/?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params});};

export const removeScreenpage = params => { return axios.delete(`${base}/screensaverMaterial/bizScreensaverMaterial/?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params});};

export const removeTerminalManage = params => { return axios.delete(`${base}/terminal/bizTerminal/?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params});};

export const removeScreenManage = params => { return axios.delete(`${base}/screensaver/bizScreensaver/?token=` + JSON.parse(window.localStorage.getItem('token')), {params:params})}

export const removeMap = params => { return axios.delete(`${base}/map/bizMap?token=` + JSON.parse(window.localStorage.getItem('token')),{params:params})}

export const removeUserName = params => { return axios.delete(`${base}/user/user?token=` + JSON.parse(window.localStorage.getItem('token')),{ params:params} )}


//编辑

export const editUser = params => { return axios.put(`${base}/shop/bizShop?token=` + JSON.parse(window.localStorage.getItem('token')), params ); };

export const editState = params => { return axios.put(`${base}/bizFormat/bizFormat?token=` + JSON.parse(window.localStorage.getItem('token')), params); };

export const editFloor = params => { return axios.put(`${base}/floor/bizFloor?token=` + JSON.parse(window.localStorage.getItem('token')), params); };

export const editActive = params => { return axios.put(`${base}/activity/bizActivity?token=` + JSON.parse(window.localStorage.getItem('token')),  params); };

export const editScreen = params => { return axios.put(`${base}/screensaverMaterial/bizScreensaverMaterial?token=` + JSON.parse(window.localStorage.getItem('token')), params)};

export const editActivepage = params => { return axios.put(`${base}/activityMaterial/bizActivityMaterial?token=` + JSON.parse(window.localStorage.getItem('token')),params);};

export const editScreenpage = params => { return axios.put(`${base}/screensaver/bizScreensaver?token=` + JSON.parse(window.localStorage.getItem('token')), params)};

export const editTerminaManage = params => { return axios.put(`${base}/terminal/bizTerminal?token=` + JSON.parse(window.localStorage.getItem('token')),params)};

export const editMap = params => { return axios.put(`${base}/map/bizMap?token=` + JSON.parse(window.localStorage.getItem('token')),params)}
//商铺有效期
export const editShopTime = params => { return axios.put(`${base}/shop/shops?token=` + JSON.parse(window.localStorage.getItem('token')),params)}
//首页轮播图有效期
export const editfirstPic = params => { return axios.put(`${base}/screensaverMaterial/bizScreensaverMaterial?token=` + JSON.parse(window.localStorage.getItem('token')),params)};

//角色权限
export const auth = params => { return axios.get(`${base}/authorities?token=` + JSON.parse(window.localStorage.getItem('token')),params)};

export const rolePost = params => { return axios.post(`${base}/roles?token=` + JSON.parse(window.localStorage.getItem('token')),params)}

export const roleGet = params => { return axios.get(`${base}/roles?token=` + JSON.parse(window.localStorage.getItem('token')),params)}

export const roleDel = params => { return axios.delete(`${base}/roles?token=` + JSON.parse(window.localStorage.getItem('token')),{params:params})}

export const rolePage = params => {return axios.get(`${base}/roles/page?token=` + JSON.parse(window.localStorage.getItem('token')),{params:params})}

export const roleAuthRole = params => {return axios.get(`${base}/authorities/checked/role?token=` + JSON.parse(window.localStorage.getItem('token')),{params:params})}

export const roleEdit = params => {return axios.put(`${base}/roles?token=` + JSON.parse(window.localStorage.getItem('token')),params)}

export const authUser = params => {return axios.get(`${base}/authorities/user?token=` + JSON.parse(window.localStorage.getItem('token')),{params,params})}
//
export const authRole = params => {return axios.get(`${base}/authorities/role?token=` + JSON.parse(window.localStorage.getItem('token')),{params,params})}

export const roleUser = params => {return axios.get(`${base}/roles/user?token=` + JSON.parse(window.localStorage.getItem('token')),{params,params})}

//新增

export const addUser = params => { return axios.post(`${base}/shop/bizShop?token=` + JSON.parse(window.localStorage.getItem('token')), params); };

export const addState = params => { return axios.post(`${base}/bizFormat/bizFormat/?token=` + JSON.parse(window.localStorage.getItem('token')), params);};

export const addFloor = params => { return axios.post(`${base}/floor/bizFloor/?token=` + JSON.parse(window.localStorage.getItem('token')), params);};

export const addActive = params => { return axios.post(`${base}/activity/bizActivity/?token=` + JSON.parse(window.localStorage.getItem('token')), params);};

export const addScreenManagement = params => { return axios.post(`${base}/screensaver/bizScreensaver/?token=` + JSON.parse(window.localStorage.getItem('token')), params);}

export const addTerminalManagement = params => { return axios.post(`${base}/terminal/bizTerminal/?token=` + JSON.parse(window.localStorage.getItem('token')), params);}

export const addActiveMaterial = params => { return axios.post(`${base}/activityMaterial/bizActivityMaterial/?token=` + JSON.parse(window.localStorage.getItem('token')), params);};

export const addScreenMaterial = params => { return axios.post(`${base}/screensaverMaterial/bizScreensaverMaterial/?token=` + JSON.parse(window.localStorage.getItem('token')), params);};

export const addMap = params => { return axios.post(`${base}/map/bizMap?token=` + JSON.parse(window.localStorage.getItem('token')), params)};

export const addUserName = params => { return axios.post(`${base}/user/user?token=` + JSON.parse(window.localStorage.getItem('token')),params)}

export const addFirstPage = params => { return axios.post(`${base}/terminal/boundFirstPage?token=` + JSON.parse(window.localStorage.getItem('token')),params)}
//启停

export const switchStart = params => { return axios.delete(`${base}/shop/bizShop/?token=` + JSON.parse(window.localStorage.getItem('token')), {params:params})}

export const config = params => { return axios.post(`${base}/terminal/config?token=` + JSON.parse(window.localStorage.getItem('token')), params )}


