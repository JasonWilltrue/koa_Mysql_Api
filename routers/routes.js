'use strict';
/**
 * 请求分为门户网址与后台
 *  其中门户网址中的登录与后台登录一致
 *  其他信息均分开
 */

const router = require('koa-router')();
const User = require('../controller/user');
const Category = require('../controller/category');
const Product = require('../controller/products');
const QiNiu = require('../controller/qiniu');
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

/**
 * 更新或增加产品
 */
router.get('/manage/product/save.do', Product.addProducts);
/**
 * 商品列表
 */
router.get('/manage/product/list.do', Product.getProductList);
/**
 *  商品详情
 */
router.get('/manage/product/detail.do', Product.getProductDetail);
/**
 *  商品搜索
 */
router.get('/manage/product/search.do', Product.searchProduct);
/**
 *  商品上下架状态
 */
router.get('/manage/product/set_sale_status.do', Product.setProductStatus);
/**
 * 获取七牛云Token
 */
router.get('/api/getuptoken', QiNiu.getUpToken);
/**
 * 图片上传
 */
router.get('/manage/product/upload.do', Product.addProducts);
/**
 * 富文本上传图片
 */
router.get('/manage/product/richtext_img_upload.do', Product.addProducts);

module.exports = router;
