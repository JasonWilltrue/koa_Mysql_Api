/*
 * @Author: Jerrychan
 * @Date: 2018-11-06 16:43:06
 * @LastEditors: Jerrychan
 * @LastEditTime: 2018-11-06 16:43:17
 * @Description: 数据库参数  后台端口参数
 */
const config = {
  // 启动端口
  port: 3000,
  // 数据库配置
  database: {
    DATABASE: 'mmall',
    USERNAME: 'root',
    PASSWORD: '123456',
    PORT: '3306',
    HOST: 'localhost'
  }
}

module.exports = config