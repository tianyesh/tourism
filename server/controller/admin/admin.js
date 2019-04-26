'use strict';

import AdminModel from '../../models/admin/admin'
import AddressComponent from '../../prototype/addressComponent'
import crypto from 'crypto'
import formidable from 'formidable'
import dtime from 'time-formater'
const configs = require('../../config/default.js')

class Admin extends AddressComponent {
	constructor(){
    super()
		this.login = this.login.bind(this)
		this.register = this.register.bind(this)
		this.encryption = this.encryption.bind(this)
		this.updateAvatar = this.updateAvatar.bind(this)
	}
	async login(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 0,
					type: 'FORM_DATA_ERROR',
					message: '表单信息错误'
				})
				return
			}
			const {user_name, password, status = 1} = fields;
			try{
				if (!user_name) {
					throw new Error('用户名参数错误')
				}else if(!password){
					throw new Error('密码参数错误')
				}
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'GET_ERROR_PARAM',
					message: err.message,
				})
				return
			}
			const newpassword = this.encryption(password);
			try{
				const admin = await AdminModel.findOne({user_name})
				if (!admin) {
					res.send({
						status: 0,
						type: 'NO_USER',
						message: '该账号不存在'
					})
				}else if(newpassword.toString() != admin.password.toString()){
					console.log('用户登录密码错误');
					res.send({
						status: 0,
						type: 'ERROR_PASSWORD',
						message: '该用户已存在，密码输入错误',
					})
				}else{
					req.session.admin_id = admin.id;
					res.send({
						status: 1,
						success: '登录成功',
						admin: admin.admin
					})
				}
			}catch(err){
				console.log('登录用户失败', err);
				res.send({
					status: 0,
					type: 'LOGIN_ADMIN_FAILED',
					message: '登录用户失败',
				})
			}
		})
	}
  async register(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 0,
					type: 'FORM_DATA_ERROR',
					message: '表单信息错误'
				})
				return
			}
			const {user_name, password, status = 1} = fields;
			try{
				if (!user_name) {
					throw new Error('用户名错误')
				}else if(!password){
					throw new Error('密码错误')
				}
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'GET_ERROR_PARAM',
					message: err.message,
				})
				return
			}
			try{
				const admin = await AdminModel.findOne({user_name})
				if (admin) {
					console.log('该用户已经存在');
					res.send({
						status: 0,
						type: 'USER_HAS_EXIST',
						message: '该用户已经存在',
					})
				}else{
					const adminTip = status == 1 ? '用户' : '超级管理员'
					const admin_id = await this.getId('admin_id');
					const newpassword = this.encryption(password);
					const newAdmin = {
						user_name, 
						password: newpassword, 
						id: admin_id,
						create_time: dtime(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						admin: adminTip,
						status,
					}
					await AdminModel.create(newAdmin)
					req.session.admin_id = admin_id;
					res.send({
						status: 1,
						message: '注册用户成功',
						admin: adminTip
					})
				}
			}catch(err){
				console.log('注册用户失败', err);
				res.send({
					status: 0,
					type: 'REGISTER_ADMIN_FAILED',
					message: '注册用户失败',
				})
			}
		})
	}
	encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
	async singout(req, res, next){
		try{
			delete req.session.admin_id;
			res.clearCookie(configs.session.name, { path: '/' });
			req.session.destroy();
			res.send({
				status: 1,
				success: '退出成功'
			})
		}catch(err){
			console.log('退出失败', err)
			res.send({
				status: 0,
				message: '退出失败'
			})
		}
	}
	async getAllAdmin(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const allAdmin = await AdminModel.find({}, '-_id -password').sort({id: -1}).skip(Number(offset)).limit(Number(limit))
			res.send({
				status: 1,
				data: allAdmin,
			})
		}catch(err){
			console.log('获取超级管理列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_LIST',
				message: '获取超级管理列表失败'
			})
		}
	}
  async updateAvatar(req, res, next){
		const admin_id = req.params.admin_id;
		if (!admin_id || !Number(admin_id)) {
			console.log('admin_id参数错误', admin_id)
			res.send({
				status: 0,
				type: 'ERROR_ADMINID',
				message: 'admin_id参数错误',
			})
			return 
		}

		try{
			const image_path = await this.getPath(req);
			await AdminModel.findOneAndUpdate({id: admin_id}, {$set: {avatar: image_path}});
			res.send({
				status: 1,
				image_path,
			})
		}catch(err){
			console.log('上传图片失败', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				message: '上传图片失败'
			})
		}
	}
}

export default new Admin()