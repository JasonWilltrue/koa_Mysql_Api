const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const moment = require('moment');
const fs = require('fs');

/**
 * 注册
 */
exports.postRegister = async ctx => {
	let { username, password, email, phone, question, answer } = ctx.request.body;
	console.log(username, password, email, phone, question, answer);
	//查询用户是否存在
	await userModel.findDataCountByName(username).then(async result => {
		console.log(result);
		if (result[0].count >= 1) {
			// 用户存在
			ctx.body = {
				status: 1,
				msg: '用户存在',
			};
		} else if (password.trim() === '') {
			ctx.body = {
				status: 1,
				msg: '两次输入的密码不一致',
			};
		} else {
			await userModel
				.insertData([
					username,
					md5(password),
					email,
					phone,
					question,
					answer,
					moment().format('YYYY-MM-DD HH:mm:ss'),
					'',
					0,
				])
				.then(res => {
					console.log('注册成功', res);
					//注册成功
					ctx.body = {
						status: 0,
						msg: '注册成功',
					};
				});
		}
	});
};

/**
 * 登录
 */
exports.postLogin = async ctx => {
	console.log(ctx.request.body);
	let { username, password } = ctx.request.body;
	await userModel
		.findDataByName(username)
		.then(result => {
			let res = result;
			console.log(res);
			if (res.length && username === res[0]['username'] && md5(password) === res[0]['password']) {
				//  为什么传了session则不能返回下面的body
				// ctx.session = {
				//   username: res[0]['username'],
				//     id: res[0]['id']
				// }
				ctx.body = {
					status: 0,
					data: {
						id: res[0]['id'],
						username: res[0]['username'],
						email: res[0]['email'],
						phone: res[0]['phone'],
						role: res[0]['role'],
						createTime: res[0]['createtime'],
						updateTime: res[0]['updatetime'],
					},
				};
				console.log('ctx.session.id', ctx.session.id);
				console.log('session', ctx.session);
				console.log('登录成功');
			} else {
				ctx.body = {
					status: 1,
					msg: '用户名或密码错误',
				};
				console.log('用户名或密码错误!');
			}
		})
		.catch(err => {
			console.log(err);
		});
};

/**
 * 检查用户是否存在
 */
exports.getCheckName = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let username = req_query.username.trim();

	await userModel
		.findDataCountByName(username)
		.then(result => {
			if (result[0].count >= 1) {
				// 用户存在
				ctx.body = {
					status: 1,
					msg: '用户存在',
				};
			} else {
				ctx.body = {
					status: 0,
					msg: '校验成功',
				};
			}
		})
		.catch(err => {
			console.log(err);
		});
};

/**
 * 获取登录用户信息(未完成)
 */
exports.getUserInfo = async ctx => {};

/**
 * 找回密码第一步查询此用户是否存在
 */
exports.getQuestion = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let username = req_query.username.trim();

	await userModel
		.findDataByName(username)
		.then(res => {
			ctx.body = {
				status: 0,
				data: res[0]['question'],
			};
		})
		.catch(err => {
			ctx.body = {
				status: 1,
				msg: '该用户不存在或该用户未设置找回密码问题',
			};
		});
};

/**
 * 找回密码第二步查询此回答问题
 */
exports.getCheckAnswer = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let { username, question, answer } = req_query;
	await userModel
		.findDataByName(username.trim())
		.then(res => {
			if (res[0]['question'] === question && res[0]['answer'] === answer) {
				ctx.body = {
					status: 0,
					data: '531ef4b4-9663-4e6d-9a20-fb56367446a5',
				};
			} else {
				ctx.body = {
					status: 1,
					msg: '问题答案错误',
				};
			}
		})
		.catch(err => {
			ctx.body = {
				status: 1,
				msg: '该用户不存在或该用户未设置找回密码问题',
			};
		});
};

/**
 * 忘记密码的重设密码
 */
exports.getRestPassword = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let { username, passwordNew, forgetToken } = req_query;
	console.log(username, passwordNew, forgetToken);
	let id = 0;
	await userModel
		.findDataByName(username.trim())
		.then(res => {
			id = res[0]['id'];
		})
		.catch(err => {
			ctx.body = {
				status: 1,
				msg: '该用户不存在或该用户未设置找回密码问题',
			};
		});

	await userModel
		.forgetResetPassword([md5(passwordNew), moment().format('YYYY-MM-DD HH:mm:ss'), id])
		.then(res => {
			console.log(res);
			ctx.body = {
				status: 0,
				msg: '修改密码成功',
			};
		})
		.catch(err => {
			console.log('错误:' + id, passwordNew);
			console.log(err);
			ctx.body = {
				status: 1,
				msg: '修改密码失败',
			};
		});
};

/**
 * 登录中状态重置密码
 */

/**
 * 登录状态更新个人信息
 */

/**
 * 获取用户列表
 */
exports.getUsersList = async ctx => {
	let { pageSize, pageNum } = ctx.request.body;
	pageSize = parseInt(pageSize) || 10;
	pageNum = parseInt(pageNum) || 1;

	let reslist = [];
	await userModel
		.findUsersById(pageNum)
		.then(async res => {
			//获取总数量
			let total = 0;
			await userModel.findUserTotalData().then(res => {
				total = res.length;
				console.log('total: ' + total);
			});
			console.log('123');

			//获取范围内的list
			for (let i = 0, len = res.length; i < len; i++) {
				const element = res[i];
				data = {
					id: element.id,
					username: element.username,
					password: '',
					email: element.email,
					phone: element.phone,
					question: element.question,
					answer: element.answer,
					role: element.role,
					createTime: element.createTime,
					updateTime: element.updateTime,
				};
				reslist.push(data);
			}
			let pages = Math.ceil(total / 10);
			ctx.body = {
				status: 0,
				data: {
					pageNum: pageNum,
					pageSize: 10,
					orderBy: null,
					total: total,
					pages: pages,
					list: reslist,
					firstPage: 1,
					prePage: pageNum - 1 === 0 ? 1 : pageNum - 1,
					nextPage: pageNum + 1 >= pages ? pages : pageNum + 1,
					// lastPage: pages,
					// isFirstPage: pageNum === 1 ? true : false,
					// isLastPage: pageNum == pages ? true : false,
				},
			};
		})
		.catch(err => {
			ctx.body = {
				status: 1,
				msg: err ? err : '返回数据错误！',
			};
		});
};
