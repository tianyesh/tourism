'use strict';

import mongoose from 'mongoose'
import adminData from '../../initdata/admin.js'
import crypto from 'crypto'
import dtime from 'time-formater'

const Schema = mongoose.Schema;

const encryption = (password) => {
	const newpassword = Md5(Md5(password).substr(2, 7) + Md5(password));
	return newpassword
}
const Md5 = (password) => {
	const md5 = crypto.createHash('md5');
	return md5.update(password).digest('base64');
}

const adminSchema = new Schema({
	user_name: String,
	password: String,
	id: Number,
	create_time: String,
	admin: {type: String, default: '管理员'},
	status: Number,  //1:普通管理、 2:超级管理员
	avatar: {type: String, default: 'default.jpg'},
	city: String,
})

adminSchema.index({id: 1});

const Admin = mongoose.model('Admin', adminSchema);

Admin.findOne((err,data)=>{
	if(!data){
		adminData.forEach(item=>{
			const newpassword = Md5(Md5(item.password).substr(2, 7) + Md5(item.password));
			const create_time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss');
			item.password = newpassword;
			item.create_time = create_time;
			console.log(item)
			Admin.create(item);
		})
	}
})

export default Admin
