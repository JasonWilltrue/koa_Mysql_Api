'use strict';
/**
 * 请求分为门户网址与后台
 *  其中门户网址中的登录与后台登录一致
 *  其他信息均分开
 */

const router = require('koa-router')();
const User = require('../controller/user');
const Category = require('../controller/category');

/**
 * 门户分为
 * 用户
 * 产品
 * 购物车
 * 订单
 *
 */
router.get('/', function(ctx) {
	ctx.body = {
		status: 1,
		msg: '方法错误，请输入正确的请求地址',
	};
});

/**
 * 注册
 */
router.post('/user/register.do', User.postRegister);
/**
 * 登录
 */
router.post('/user/login.do', User.postLogin);
/**
 * 检查名字是否存在
 */
router.get('/user/check_valid.do', User.getCheckName);
/**
 * 获取用户详情信息
 */
router.get('/user/get_user_info.do', User.getUserInfo);
/**
 * 获取找回密码  问题
 */
router.get('/user/forget_get_question.do', User.getQuestion);
/**
 * 检查答案是否正确
 */
router.get('/user/forget_check_answer.do', User.getCheckAnswer);
/**
 * 初始化密码
 */
router.get('/user/forget_reset_password.do', User.getRestPassword);

/**
 * 后台分为
 * 用户
 * 商品
 * 订单
 * 统计
 */
/**
 * 获取用户列表
 */
router.post('/manage/user/list.do', User.getUsersList);
/**
 * 添加品类名
 */
router.post('/manage/category/add_category.do', Category.addCategory);
router.get('/manage/category/get_category.do', Category.getCategory);
//更新类别名
router.get('/manage/category/set_category_name.do', Category.setCategoryName);

module.exports = router;
