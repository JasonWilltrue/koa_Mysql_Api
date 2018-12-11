const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const moment = require('moment');
const fs = require('fs');

/**
 * 更新或增加产品
 */
exports.addProducts = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let { categoryId, name, subtitle, subImages, detail, price, stock, status, id } = req_query;
	//id存在则是修改否则是添加
	if (id) {
		//修改  categoryId=1&name=三星洗衣机&subtitle=三星大促销&subImages=test.jpg&detail=detailtext&price=1000&stock=100&status=1&id=3
		await userModel
			.updateProductById([categoryId, name, subtitle, subImages, detail, price, stock, status, id])
			.then(res => {
				console.log(res);
				ctx.body = {
					status: 0,
					msg: '商品更新成功',
				};
			})
			.catch(err => {
				ctx.body = {
					status: 1,
					msg: err,
				};
			});
	} else {
		//增加 categoryId=1&name=三星洗衣机&subtitle=三星大促销&subImages=test.jpg,11.jpg,2.jpg,3.jpg&detail=detailtext&price=1000&stock=100&status=1
		console.log(categoryId, name, subtitle, subImages, detail, price, stock, status, id);
		TODO: 增加用一个商品名称只能添加一次限制;
		await userModel
			.insertProductData([categoryId, name, subtitle, subImages, detail, price, stock, status])
			.then(res => {
				ctx.body = {
					status: 0,
					msg: '添加商品成功！',
				};
			})
			.catch(err => {
				ctx.body = {
					status: 1,
					msg: err,
				};
			});
	}
};
/**
 * 商品列表
 */
exports.getProductList = async ctx => {
	let request = ctx.request;
	let req_query = request.query;
	let pageNum = parseInt(req_query.pageNum) || 1;
	let listData = [];
	await userModel
		.findAllProduct(pageNum)
		.then(res => {
			//获取总条数
			//获取list
			for (let i = 0; i < res.length; i++) {
				let result = {};
				result = {
					id: res[i].id,
					categoryId: res[i].categoryId,
					name: res[i].name,
					subtitle: res[i].subtitle,
					mainImage: res[i].subImages,
					status: res[i].status,
					price: res[i].price,
				};
				listData.push(result);
			}
			console.log(listData);
			ctx.body = {
				status: 0,
				data: {
					pageNum: pageNum,
					pageSize: 10,
					size: 2,
					orderBy: null,
					startRow: 1,
					endRow: 2,
					total: 2,
					pages: 1,
					list: listData,
					firstPage: 1,
					prePage: 0,
					nextPage: 0,
					lastPage: 1,
					isFirstPage: true,
					isLastPage: true,
					hasPreviousPage: false,
					hasNextPage: false,
				},
			};
		})
		.catch(err => {
			ctx.body = {
				status: 10,
				msg: '用户未登录,请登录',
			};
		});
};

/**
 *  商品详情
 */
exports.getProductDetail = async ctx => {};

/**
 *  商品搜索
 */
exports.searchProduct = async ctx => {};

/**
 *  商品上下架状态
 */
exports.setProductStatus = async ctx => {};
