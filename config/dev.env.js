var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //新增
  // BASE_API: '"/api"'
  BASE_API: '"http://47.94.202.250:9000"', 
})
