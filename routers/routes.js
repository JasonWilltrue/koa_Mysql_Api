"use strict";
const router = require('koa-router')();
const User = require('../controller/user')


router.post('/user/register.do', User.postRegister)
router.post('/user/login.do', User.postLogin)


router.get('/user/check_valid.do', User.getCheckName)
router.get('/user/get_user_info.do', User.getUserInfo)

router.get('/user/forget_get_question.do', User.getQuestion)
router.get('/user/forget_check_answer.do', User.getCheckAnswer)
router.get('/user/forget_reset_password.do', User.getRestPassword)

 module.exports = router;
