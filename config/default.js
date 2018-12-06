/*
 * @Author: Jerrychan
 * @Date: 2018-11-06 16:43:06
 * @LastEditors: Jerrychan
 * @LastEditTime: 2018-12-06 01:12:26
 * @Description: 数据库参数  后台端口参数
 */
const config = {
	// 启动端口
	port: 3000,
	// 数据库配置
	database: {
		DATABASE: 'bg_mall',
		USERNAME: 'root',
		PASSWORD: '123456',
		PORT: '3306',
		HOST: 'localhost',
	},
};

module.exports = config;
