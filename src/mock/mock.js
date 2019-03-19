import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// MockAdapter是一个模拟后台get的请求，es6语法
import {
  LoginUsers,
  Users,
  shops,
  states,
  floors,
  actives,
  screens,
  screenmanage,
  terminalmanage
} from './data/user';
//同样以LoginUsers, Users 的方式来接收，from的url
let _Users = Users;
let _shops = shops;
let _states = states;
let _floors = floors;
let _actives = actives;
let _screens = screens;
let _screenmanage =screenmanage;
let _terminalmanage =terminalmanage;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {
        username,
        password
      } = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, {
              code: 200,
              msg: '请求成功',
              user
            }]);
          } else {
            resolve([200, {
              code: 500,
              msg: '账号或密码错误'
            }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      // console.log(config);
      //config.params放的是用户输入的name,params是user.vue中传递的
      // let {
      //   name,
      //   floor
      // } = config.params;
      // let mockUsers = _Users.filter(user => {
      //   if (name && user.name.indexOf(name) == -1) return false;
      //   return true;
      // });

      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve([200, {
      //       users: mockUsers
      //     }]);
      //   }, 1000);
      // });

      let mockshops = _shops.filter(user => {
        if (name && user.name.indexOf(name) == -1)  return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            shops: mockshops
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(
      config => {
        //商铺管理
        let {
          page,
          name
        } = config.params;
        let mockshops = _shops.filter(user => {
          if (name && user.name.indexOf(name) == -1) return false;
          return true;
        });
        let total = mockshops.length;
        mockshops = mockshops.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([200, {
              total: total,
              shops: mockshops
            }]);
          }, 1000);
        });
      }
    );

    //业态数据
    mock.onGet('/user/statpage').reply(config => {
      let {
        page,
        name
      } = config.params;
      let mockstates = _states.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockstates.length;
      mockstates = mockstates.filter((u, index) => index < 10 * page && index >= 10 * (page - 1));

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            states: mockstates
          }]);
        }, 1000);
      });
    });

    //楼层数据
    mock.onGet('/user/floorpage').reply(config => {
      let {
        page,
        name
      } = config.params;
      let mockfloors = _floors.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockfloors.length;
      mockfloors = mockfloors.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            floors: mockfloors
          }]);
        }, 1000);
      });
    });

    //活动数据
    mock.onGet('/user/activepage').reply(config => {
      let {
        page,name
      } = config.params;
      let mockactives = _actives.filter(user => {
        if(name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockactives.length;
      mockactives = mockactives.filter((u,index) => index < 10*page && index >=10*(page - 1));
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            actives: mockactives
          }]);
        },1000);
      })
    });

    //屏保数据
    mock.onGet('/user/screenpage').reply(config => {
      let{ page, name} = config.params;
      let mockscreens = _screens.filter(user => {
        if(name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockscreens.length;
      mockscreens= mockscreens.filter((u,index) => index < 10*page && index >= 10*(page - 1));
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200,{
            total:total,
            screens:mockscreens
          }]);
        },1000)
      })
    });
    //屏保管理数据
    mock.onGet('/user/screenmanagementpage').reply(config => {
      let {page,name}=config.params;
      let mockscreenmanage = _screenmanage.filter(user => {
        if(name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockscreenmanage.length;
      mockscreenmanage = mockscreenmanage.filter((u,index) => index < 10*page && index >=10*(page - 1));
      return new Promise((resolve,reject) => {
        setTimeout(()=>{
          resolve([200,{
            total:total,
           screenmanage:mockscreenmanage
          }]);
        },1000)
      })
    });

    //终端
    mock.onGet('/user/terminalmanage').reply(config => {
      let{page,name} = config.params;
      let mockterminalmanage = _terminalmanage.filter(user => {
        if(name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockterminalmanage.length;
      mockterminalmanage = mockterminalmanage.filter((u,index) => index < 10*page && index >=10*(page - 1));
      return new Promise((resolve,reject) => {
        setTimeout(()=>{
          resolve([200,{
            total:total,
            terminalmanage:mockterminalmanage
          }]);
        },1000)
      })
    
    })

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let {
        id
      } = config.params;
      // _Users = _Users.filter(u => u.id !== id);
      _shops = _shops.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //states删除
    mock.onGet('/state/remove').reply(config => {
      let {id} = config.params;
      _states = _states.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    })

     //floors删除
     mock.onGet('/floor/remove').reply(config => {
      let {id} = config.params;
      _floors = _floors.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    })

    //active删除
    mock.onGet('/active/remove').reply(config => {
      let{id} = config.params;
      _actives = _actives.filter(u => u.id !==id );
      return new Promise((resolve,reject) => {
        setTimeout(()=>{
          resolve([200,{
            code:200,
            msg:'删除成功'
          }])
        },500)
      })
    })

    //screen删除
    mock.onGet('/screenpage/remove').reply(config => {
      let{id} = config.params;
      _screens = _screens.filter(u => u.id !==id );
      return new Promise((resolve,reject) => {
        setTimeout(()=>{
          resolve([200,{
            code:200,
            msg:'删除成功'
          }])
        },500)
      })
    })

    //屏保删除
    mock.onGet('/screenmanage/remove').reply(config=>{
      let{id} = config.params;
      _screenmanage=_screenmanage.filter(u=> u.id !==id);
      return new Promise((resolve,reject) => {
        setTimeout(()=>{
          resolve([200,{
            code:200,
            msg:'删除成功 '
          }])
        },500)
      })
    })

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let {
        ids
      } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let {
        id,
        code,
        name,
        Ename,
        num,
        date,
        addr,
      } = config.params;
      _shops.some(u => {
        if (u.id === id) {
          u.code = code;
          u.name = name;
          u.Ename = Ename;
          u.num = num;
          u.date = date;
          u.addr = addr;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //state编辑
    mock.onGet('/state/edit').reply(config => {
      let {
        id,
        code,
        name,
      } = config.params;
      _states.some(u => {
        if (u.id === id) {
          u.code = code;
          u.name = name;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //floor编辑
    mock.onGet('/floor/edit').reply(config => {
      let {
        id,
        code,
        name,
      } = config.params;
      _floors.some(u => {
        if (u.id === id) {
          u.code = code;
          u.name = name;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //active
    mock.onGet('/active/edit').reply(config => {
      let {id,type} = config.params;
      _actives.some(u => {
        if(u.id === id) {
          u.type = type;
          return true;
        }
      });
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200,{
            code:200,
            msg:"编辑成功"
          }]);
        },500)
      })
    })

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let {
        id,
        code,
        name,
        Ename,
        num,
        date,
        addr,
      } = config.params;
      _shops.push(
        {id:id,code:code,name:name,Ename:Ename,num:num,date:date,addr:addr
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //新增states
    mock.onGet('state/add').reply(config => {
      let {id,code,name}= config.params;
      _states.push(
        {id:id,code:code,name:name}
      )
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      })
    });

    //新增floors
    mock.onGet('floor/add').reply(config => {
      let {id,code,name}= config.params;
      _floors.push(
        {id:id,code:code,name:name}
      )
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      })
    });

    //新增active
    mock.onGet('active/add').reply(config => {
      let {id,type} = config.params;
      _actives.unshift(
        {id:id,type:type}
      )
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200,{
            code:200,
            msg:'新增成功'
          }])
        },500)
      })
    });

    //新增screenManage
    mock.onGet('screenmanagement/add').reply(config => {
      let {id,name,date} = config.params;
      _screenmanage.unshift(
        {id:id,name:name,date:new Date()}
      )
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve([200,{
            code:200,
            msg:'添加成功'
          }])
        },500)
      })
    })
    //新增terminalmanage
  


  }
};