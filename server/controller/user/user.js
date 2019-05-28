'use strict';

import AdminModel from '../../models/admin/admin'
import HotelModel from '../../models/hotel/hotel'
import TravelModel from '../../models/travel/travel'
import AddressComponent from '../../prototype/addressComponent'
import crypto from 'crypto'
import formidable from 'formidable'
import dtime from 'time-formater'

class User extends AddressComponent {
	constructor(){
		super()
		this.addUser = this.addUser.bind(this)
		this.updateAvatar = this.updateAvatar.bind(this)
	}
	async updateAvatar(req, res, next){
		const id = req.params.id;
		if (!id || !Number(id)) {
			console.log('id参数错误', id)
			res.send({
				status: 0,
				type: 'ERROR_ADMINID',
				message: 'id参数错误',
			})
			return 
		}

		try{
			const image_path = await this.getPath(req);
			await AdminModel.findOneAndUpdate({id: id}, {$set: {avatar: image_path}});
			// 更新头像地址
			const hotelList = HotelModel.findOneAndUpdate({});

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
  async getUserInfo(req, res, next){
		const admin_id = req.session.admin_id;
		console.log('admin_id: '+JSON.stringify(req.session))
		if (!admin_id || !Number(admin_id)) {
			console.log('获取管理员信息的session失效');
			res.send({
				status: 0,
				type: 'ERROR_SESSION',
				message: '获取管理员信息失败'
			})
			return 
		}
		try{
			const info = await AdminModel.findOne({id: admin_id}, '-_id -__v -password');
			if (!info) {
				throw new Error('未找到当前管理员')
			}else{
				res.send({
					status: 1,
					data: info
				})
			}
		}catch(err){
			console.log('获取管理员信息失败');
			res.send({
				status: 0,
				type: 'GET_ADMIN_INFO_FAILED',
				message: '获取管理员信息失败'
			})
		}
	}
	async getUserList(req, res, next){
		const {limit = 10, offset = 0} = req.query;
		try{
			const userList = await AdminModel.find({}, '-_id -password -__v').sort({id: -1}).skip(Number(offset)).limit(Number(limit))
			res.send({
				status: 1,
				data: userList,
			})
		}catch(err){
			console.log('获取用户列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_USER_LIST',
				message: '获取用户列表失败'
			})
		}
	}
	async addUser(req, res, next){
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
			const {userName, password, city = '', status = 1} = fields;
			console.log(JSON.stringify(fields))
			try{
				if (!userName) {
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
				console.log(userName)
				const admin = await AdminModel.findOne({user_name:userName})
				console.log(admin)
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
						user_name:userName, 
						password: newpassword, 
						id: admin_id,
						city,
						create_time: dtime(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						admin: adminTip,
						status,
					}
					await AdminModel.create(newAdmin)
					res.send({
						status: 1,
						message: '添加用户成功',
						admin: adminTip
					})
				}
			}catch(err){
				console.log('添加用户失败', err);
				res.send({
					status: 0,
					type: 'REGISTER_ADMIN_FAILED',
					message: '添加用户失败',
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
	async editUser(req, res, next){
		const id = req.params.id;
		if (!id || !Number(id)) {
			console.log('id参数错误', id)
			res.send({
				status: 0,
				type: 'ERROR_ADMINID',
				message: 'id参数错误',
			})
			return 
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取用户form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}
			const {userName, city} = fields;
			try{
				if (!userName) {
					throw new Error('用户名称错误');
				}
				let newData;
				newData = {user_name: userName,city};
				const user = await AdminModel.findOneAndUpdate({id}, {$set: newData});
				res.send({
					status: 1,
					success: '修改用户名成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_USERNAME',
					message: '更新用户名失败',
				})
			}
		})
	}
  async delUser(req, res, next){
    const id = req.params.id;
    if (!id || !Number(id)) {
			console.log('id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'id参数错误',
			})
			return 
    }
    try{
			const admin = await AdminModel.findOne({id})
			if (admin.status === 2) {
				res.send({
					status: 0,
					message: '超级管理员不可删除',
				})
				return
			} else {
				await AdminModel.remove({id: id});
				res.send({
					status: 1,
					success: '删除用户成功',
				})
			}
		}catch(err){
			console.log('删除用户失败', err);
			res.send({
				status: 0,
				type: 'DELETE_USER_FAILED',
				message: '删除用户失败',
			})
		}
	}
}

export default new User()