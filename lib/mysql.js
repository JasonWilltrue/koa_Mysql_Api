var mysql = require('mysql');
var config = require('../config/default.js');

var pool = mysql.createPool({
	host: config.database.HOST,
	user: config.database.USERNAME,
	password: config.database.PASSWORD,
	database: config.database.DATABASE,
	port: config.database.PORT,
});

let query = (sql, values) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject(err);
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
					connection.release();
				});
			}
		});
	});
};

/**
 * 用户表
 */
let users = `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     username VARCHAR(100) NOT NULL COMMENT '用户名',
     password VARCHAR(100) NOT NULL COMMENT '密码',
     email VARCHAR(100) NOT NULL COMMENT '邮箱',
     phone VARCHAR(100) NOT NULL COMMENT '手机',
     question VARCHAR(255) NOT NULL COMMENT '问题',
     answer VARCHAR(255) NOT NULL COMMENT '答案',
     createtime VARCHAR(100) NOT NULL COMMENT '创建时间',
     updatetime VARCHAR(100) NOT NULL COMMENT '更新时间',
     role VARCHAR(100) NOT NULL COMMENT '角色',
     PRIMARY KEY ( id )
    );`;

// /**
//  * 产品一级品类category
//  */
// let category =
//     `create table if not exists category(
//      id INT NOT NULL AUTO_INCREMENT,
//      cname VARCHAR(100) NOT NULL COMMENT '品类名',
//      createtime VARCHAR(100) NOT NULL COMMENT '创建时间',
//      updatetime VARCHAR(100) NOT NULL COMMENT '更新时间',
//      PRIMARY KEY(id)
//     );`

// /**
//  * 产品二级品类
//  */
// let childcategory =
//     `create table if not exists childcategory(
//      id INT NOT NULL AUTO_INCREMENT,
//      name VARCHAR(100) NOT NULL COMMENT '用户名称',
//      parentId INT(0) NOT NULL COMMENT '父级id',
//      status BOOLEAN(40) NOT NULL COMMENT '上下架状态',
//      createtime VARCHAR(100) NOT NULL COMMENT '创建时间',
//      updatetime VARCHAR(100) NOT NULL COMMENT '更新时间',
//      PRIMARY KEY(id)
//     );`

let createTable = sql => {
	return query(sql, []);
};

// 建表
createTable(users);

// createTable(posts)
// createTable(comment)
console.log('创建表');
// 通过名字查找用户
exports.findDataByName = name => {
	let _sql = `select * from users where username="${name}";`;
	return query(_sql);
};
// 通过名字查找用户数量判断是否已经存在
exports.findDataCountByName = name => {
	let _sql = `select count(*) as count from users where username="${name}";`;
	return query(_sql);
};
// 查找用户
exports.findUserData = name => {
	let _sql = `select * from users where username="${name}";`;
	return query(_sql);
};
// 注册用户
exports.insertData = value => {
	let _sql =
		'insert into users set username=?,password=?,email=?,phone=?,question=?,answer=?,createTime=?,updateTime=?,role=?;';
	return query(_sql, value);
};

// 忘记密码的重置密码更新;
exports.forgetResetPassword = values => {
	let _sql = `update users set password=?,updatetime=? where id=?`;
	return query(_sql, values);
};

/**
 * ==========================================================
 * 
 * 后台管理系统的增删改查

 * ==========================================================
 */

/**
 * 获取用户列表
 */
exports.findUsersById = page => {
	let start = (page - 1) * 10;
	let _sql = 'SELECT * FROM users limit ' + start + ',10';
	return query(_sql);
};
exports.findUserTotalData = () => {
	let _sql = `select * from users`;
	return query(_sql);
};
/**
 * 判断商品名是否存在
 */
exports.findCategoryNameData = (name, cid) => {
	let _sql = `select count(*) as count from category where cname="${name}";`;
	if (cid) {
		_sql = `select count(*) as count from childcategory where cname="${name}" and parentId="${cid}";`;
	}
	return query(_sql);
	// let _sql = `select * from category where cname="${name}";`;
	// return query(_sql);
};
/**
 * 添加商品
 */
exports.insertCategoryData = (value, cid) => {
	let _sql = 'insert into category set cname=?,createTime=?,updateTime=?;';
	if (cid) {
		_sql = 'insert into childcategory set parentId=?,cname=?,status=?,sortOrder=?,createTime=?,updateTime=?;';
	}
	return query(_sql, value);
};
/**
 * 获取品类列表
 */
exports.findCategoryListById = cid => {
	let _sql = `select * from category;`;
	if (cid) {
		_sql = `select * from childcategory where parentId="${cid}";`;
	}
	return query(_sql);
};

/**
 * 修改品类名称
 */
exports.updateCategoryNameById = value => {
	let _sql = `update childcategory set cname=?, updateTime=? where id=?`;
	return query(_sql, value);
};

//=========================================
// 删除用户
exports.deleteUserData = name => {
	let _sql = `delete from user where name="${name}";`;
	return query(_sql);
};

// 发表文章
exports.insertPost = value => {
	let _sql = 'insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;';
	return query(_sql, value);
};
// 增加文章评论数
exports.addPostCommentCount = value => {
	let _sql = 'update posts set comments = comments + 1 where id=?';
	return query(_sql, value);
};
// 减少文章评论数
exports.reducePostCommentCount = value => {
	let _sql = 'update posts set comments = comments - 1 where id=?';
	return query(_sql, value);
};

// 更新浏览数
exports.updatePostPv = value => {
	let _sql = 'update posts set pv= pv + 1 where id=?';
	return query(_sql, value);
};

// 发表评论
exports.insertComment = value => {
	let _sql = 'insert into comment set name=?,content=?,moment=?,postid=?,avator=?;';
	return query(_sql, value);
};

// 通过文章的名字查找用户
exports.findDataByUser = name => {
	let _sql = `select * from posts where name="${name}";`;
	return query(_sql);
};
// 通过文章id查找
exports.findDataById = id => {
	let _sql = `select * from posts where id="${id}";`;
	return query(_sql);
};
// 通过文章id查找
exports.findCommentById = id => {
	let _sql = `select * from comment where postid="${id}";`;
	return query(_sql);
};

// 通过文章id查找评论数
exports.findCommentCountById = id => {
	let _sql = `select count(*) as count from comment where postid="${id}";`;
	return query(_sql);
};

// 通过评论id查找
exports.findComment = id => {
	let _sql = `select * from comment where id="${id}";`;
	return query(_sql);
};
// 查询所有文章
exports.findAllPost = () => {
	let _sql = `select * from posts;`;
	return query(_sql);
};
// 查询所有文章数量
exports.findAllPostCount = () => {
	let _sql = `select count(*) as count from posts;`;
	return query(_sql);
};
// 查询分页文章
exports.findPostByPage = page => {
	let _sql = ` select * from posts limit ${(page - 1) * 10},10;`;
	return query(_sql);
};
// 查询所有个人用户文章数量
exports.findPostCountByName = name => {
	let _sql = `select count(*) as count from posts where name="${name}";`;
	return query(_sql);
};
// 查询个人分页文章
exports.findPostByUserPage = (name, page) => {
	let _sql = ` select * from posts where name="${name}" order by id desc limit ${(page - 1) * 10},10 ;`;
	return query(_sql);
};
// 更新修改文章
exports.updatePost = values => {
	let _sql = `update posts set title=?,content=?,md=? where id=?`;
	return query(_sql, values);
};
// 删除文章
exports.deletePost = id => {
	let _sql = `delete from posts where id = ${id}`;
	return query(_sql);
};
// 删除评论
exports.deleteComment = id => {
	let _sql = `delete from comment where id=${id}`;
	return query(_sql);
};
// 删除所有评论
exports.deleteAllPostComment = id => {
	let _sql = `delete from comment where postid=${id}`;
	return query(_sql);
};

// 滚动无限加载数据
exports.findPageById = page => {
	let _sql = `select * from posts limit ${(page - 1) * 5},5;`;
	return query(_sql);
};
// 评论分页
exports.findCommentByPage = (page, postId) => {
	let _sql = `select * from comment where postid=${postId} order by id desc limit ${(page - 1) * 10},10;`;
	return query(_sql);
};
