const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const moment = require('moment');
const fs = require('fs');

/**
 * 添加一级品类或二级品类
 */
exports.addCategory = async ctx => {
	let { parentId, categoryName } = ctx.request.body;
	// console.log(parentId, categoryName);

	await userModel
		.findCategoryNameData(categoryName, parentId ? parentId : 0)
		.then(async result => {
			// console.log(result);
			if (result[0].count >= 1) {
				ctx.body = {
					status: 1,
					msg: '商品名已存在',
				};
			} else {
				let status = 0; //默认下架
				let sortOrder = 0;
				let value = parentId
					? [parentId, categoryName, status, sortOrder, moment().format('YYYY-MM-DD HH:mm:ss'), '']
					: [categoryName, moment().format('YYYY-MM-DD HH:mm:ss'), ''];
				await userModel.insertCategoryData(value, parentId).then(result => {
					ctx.body = {
						status: 0,
						msg: '商品添加成功',
					};
				});
			}
		})
		.catch(err => {
			// console.log(err);
			ctx.body = {
				status: 1,
				msg: err,
			};
		});
};

/**
 * 获取品类列表
 */
exports.getCategory = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let categoryId = parseInt(req_query.categoryId) || 0;
	// console.log(categoryId);

	await userModel
		.findCategoryListById(categoryId)
		.then(res => {
			// console.log(res);
			if (res.length === 0) {
				ctx.body = {
					status: 0,
					msg: '未找到该商品',
				};
			}
			let data = [];
			for (let i = 0; i < res.length; i++) {
				let result = {};
				if (categoryId) {
					result = {
						id: res[i].id,
						parentId: res[i].parentId,
						name: res[i].cname,
						status: res[i].status,
						sortOrder: res[i].sortOrder,
						createTime: res[i].createTime,
						updateTime: res[i].updateTime,
					};
				} else {
					result = {
						id: res[i].id,
						name: res[i].cname,
						createTime: res[i].createTime,
						updateTime: res[i].updateTime,
					};
				}

				data.push(result);
			}
			ctx.body = {
				status: 0,
				data: data,
			};
		})
		.catch(err => {
			ctx.body = {
				status: 1,
				msg: '未找到该商品',
			};
		});
};
/**
 * 修改二级类别名
 */
exports.setCategoryName = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let categoryName = req_query.categoryName;
	let id = parseInt(req_query.categoryId) || 0;
	// console.log(id, categoryName);
	await userModel
		.updateCategoryNameById([categoryName, moment().format('YYYY-MM-DD HH:mm:ss'), id])
		.then(res => {
			// console.log(res.changedRows);
			if (res.changedRows) {
				ctx.body = {
					status: 0,
					msg: '更新品类名字成功',
				};
			} else {
				ctx.body = {
					status: 1,
					msg: '更新品类名字失败',
				};
			}
		})
		.catch(err => {
			ctx.body = {
				status: 0,
				msg: err,
			};
		});
};
