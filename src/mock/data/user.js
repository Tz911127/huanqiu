import Mock from 'mockjs';
const LoginUsers = [{
  id: 1,
  username: 'admin',
  password: '123456',
  avatar: ' ',
  name: 'admin'
}];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.name(),
    addr: Mock.mock('@county(true)'),
    'age|10-70': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

const shops = [];

for (let i = 0; i < 21; i++) {
  shops.push(Mock.mock({
    id: Mock.Random.guid(),
    code: Mock.Random.guid(),
    floor: Mock.mock('@county(true)'),
    name: Mock.Random.name(),
    addr: Mock.mock('@county(true)'),
    'age|10-70': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

const states = [];

for (let i = 0; i < 31; i++) {
  states.push(Mock.mock({
    id: Mock.Random.guid(),
    code: Mock.Random.guid(),
    name: Mock.Random.name(),
  }))
}

const floors = [];

for (let i = 0; i < 21; i++) {
  floors.push(Mock.mock({
    id: Mock.Random.guid(),
    code: Mock.Random.guid(),
    name: Mock.Random.name(),
  }))
}

const actives = [];
for(let i = 0;i < 22; i++) {
  actives.push(Mock.mock({
    id: Mock.Random.guid(),
    type:Mock.Random.guid()
  }))
}

const screens = [];
for(let i = 0;i <24;i++) {
  screens.push(Mock.mock({
    id:Mock.Random.guid(),
    name: Mock.Random.name(),
    type: Mock.Random.guid()

  }))
}

const screenmanage = [];
for(let i = 0; i < 24 ;i++) {
  screenmanage.push(Mock.mock({
    id:Mock.Random.guid(),
    name:Mock.Random.name(),
    num:parseInt(Math.random() * 100).toString(),
    issue:parseInt(Math.random() * 100).toString(),
    date:new Date()
  }))
}

const terminalmanage = [];
for(let i = 0; i < 24 ;i++) {
  terminalmanage.push(Mock.mock({
    id:Mock.Random.guid(),
    name:Mock.Random.name(),
    num:parseInt(Math.random() * 100).toString(),
    ip:new Date()
  }))
}

export {
  LoginUsers,
  Users,
  shops,
  states,
  floors,
  actives,
  screens,
  screenmanage,
  terminalmanage
};
////通过向大括号中添加LoginUsers, Users ，变量并且export输出，就可以将对应变量值以LoginUsers, Users 变量标识符形式暴露给其他文件而被读取到