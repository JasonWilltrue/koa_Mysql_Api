let qiniu = require('qiniu');

let util = require('util');
let path = require('path');

// let multiparty = require('multiparty');

let fs = require('fs');
// 读取配置信息
let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/config.json')));

let mac = new qiniu.auth.digest.Mac(config.AccessKey, config.SecretKey);

// let config2 = new qiniu.conf.Config();
// 这里主要是为了用 node sdk 的 form 直传，结合 demo 中 form 方式来实现无刷新上传
// config2.zone = qiniu.zone.Zone_z2;
// let formUploader = new qiniu.form_up.FormUploader(config2);
// let putExtra = new qiniu.form_up.PutExtra();
let options = {
	scope: config.Bucket,
	deleteAfterDays: 1,
	returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
};

let putPolicy = new qiniu.rs.PutPolicy(options);
// let bucketManager = new qiniu.rs.BucketManager(mac, null);

exports.getUpToken = async ctx => {
	let token = putPolicy.uploadToken(mac);
	if (token) {
		ctx.body = {
			uptoken: token,
			domain: config.Domain,
		};
	}
};

// app.get('/api/uptoken', function(req, res, next) {
// 	res.header('Cache-Control', 'max-age=0, private, must-revalidate');
// 	res.header('Pragma', 'no-cache');
// 	res.header('Expires', 0);
// });

// app.post('/api/transfer', function(req, res) {
// 	let form = new multiparty.Form();
// 	form.parse(req, function(err, fields, files) {
// 		let path = files.file[0].path;
// 		let token = fields.token[0];
// 		let key = fields.key[0];
// 		formUploader.putFile(token, key, path, putExtra, function(respErr, respBody, respInfo) {
// 			if (respErr) {
// 				console.log(respErr);
// 				throw respErr;
// 			}
// 			if (respInfo.statusCode == 200) {
// 				res.send('<script>window.parent.showRes(' + JSON.stringify(respBody) + ')</script>');
// 			} else {
// 				console.log(respInfo.statusCode);
// 				console.log(respBody);
// 			}
// 		});
// 	});
// });
