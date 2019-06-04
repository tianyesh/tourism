'use strict';

import HotelModel from '../../models/hotel/hotel'
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Hotel extends AddressComponent {
	constructor(){
		super()
		this.addHotel = this.addHotel.bind(this)
  }
	async getHotelList(req, res, next){
		const {offset=0, limit=10, orderType='0', province} = req.query;
		let orderObj = {
			'0': {id: -1},
			'1': {score: -1}
		}
		try{
			const hotelList = await HotelModel.find({province: province}).sort(orderObj[orderType]).limit(parseInt(limit)).skip(parseInt(offset))
			const total = await HotelModel.find({province: province}).sort(orderObj[orderType]).count()
			res.send({
				status: 1,
				data: hotelList,
				total: total
			})
		}catch(err){
			console.log('获取酒店列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_HOTEL_LIST',
				message: '获取酒店列表失败'
			})
		}
	}
	async getHotelDel(req, res, next){
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
			const hotel = await HotelModel.findOne({id});
			res.send({
				status: 1,
				data: hotel
			})
		}catch(err){
			console.log(err.message, err);
			res.send({
				status: 0,
				type: 'ERROR_GET',
				message: '查询失败',
			})
		}
	}
	async addHotel(req, res, next){
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
			const {name, introduce, province='北京', city='北京', address, score, image_url, telephone, sub_room = []} = fields;
			console.log(JSON.stringify(fields))
			try{
				if (!name) {
					throw new Error('酒店名错误')
				}
			}catch(err){
				res.send({
					status: 0,
					type: 'GET_ERROR_PARAM',
					message: err.message,
				})
				return
			}
			try{
				const hotel = await HotelModel.findOne({name})
				if (hotel) {
					console.log('该酒店已经存在');
					res.send({
						status: 0,
						type: 'HOTEL_HAS_EXIST',
						message: '该酒店已经存在',
					})
				}else{
					const hotel_id = await this.getId('hotel_id');
					sub_room.forEach((item, index)=>{
						item.room_id = index + 1;
					})
					const newHotel = {
						name, 
						introduce,
						province,
						city,
						address,
						telephone,
						id: hotel_id,
						score,
						image_url,
						create_time: dtime(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						sub_room
					}
					await HotelModel.create(newHotel)
					res.send({
						status: 1,
						message: '添加酒店成功'
					})
				}
			}catch(err){
				console.log('添加酒店失败', err);
				res.send({
					status: 0,
					type: 'REGISTER_HOTEL_FAILED',
					message: '添加酒店失败',
				})
			}
		})
	}
	async bookHotel(req, res, next) {
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
				console.log('获取form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}
			const {room_id,surplus_num} = fields;
			try{
				const hotel = await HotelModel.update({id:id,'sub_room.room_id':room_id}, {$set: {'sub_room.$.surplus_num': surplus_num}});
				res.send({
					status: 1,
					success: '修改成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE',
					message: '更新失败',
				})
			}
		})
	}
	async isCanComment(req, res, next){
		const id = req.params.id;
		const user_id = req.session.admin_id;
		if (!user_id || !Number(user_id)) {
			console.log('获取管理员信息的session失效');
			res.send({
				status: 0,
				type: 'ERROR_SESSION',
				message: '获取管理员信息失败'
			})
			return 
		}
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
			const hotel = await HotelModel.findOne({id});
			const comment = hotel.comment;
			let isCanComment = false;
			isCanComment = comment.some((item)=>{
				return item.user_id == user_id;
			})
			res.send({
				status: 1,
				data: isCanComment
			})
		}catch(err){
			console.log(err.message, err);
			res.send({
				status: 0,
				type: 'ERROR_GET',
				message: '查询失败',
			})
		}
	}
	async addHotelComment(req, res, next){
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
				console.log('获取form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}
			// const newData = fields;
			try{
				let hotel = await HotelModel.findOne({id});
				let comment = hotel.comment;
				const {describe, photo_url, score, user_id, user_name} = fields;
				const newData = {
					describe,
					photo_url,
					score,
					user_id,
					user_name,
					comment_id: comment.length + 1,
					comment_time: dtime(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					status: true,
					praise_num: 0
				}
				comment.push(newData);
				const newScore = comment.map(item => item.score).reduce((total, num) => total + num)/comment.length;
				hotel = await HotelModel.findOneAndUpdate({id}, {$set: { score: newScore, comment}});
				res.send({
					status: 1,
					success: '添加评论成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE',
					message: '添加评论失败',
				})
			}
		})
	}
	async editHotel(req, res, next){
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
				console.log('获取form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}
			const newData = fields;
			try{
				const hotel = await HotelModel.findOneAndUpdate({id}, {$set: newData});
				res.send({
					status: 1,
					success: '修改酒店成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE',
					message: '更新失败',
				})
			}
		})
	}
	async delHotel(req, res, next){
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
			await HotelModel.remove({id: id});
			res.send({
				status: 1,
				success: '删除成功',
			})
		}catch(err){
			console.log('删除失败', err);
			res.send({
				status: 0,
				type: 'DELETE_FAILED',
				message: '删除失败',
			})
		}
	}
}

export default new Hotel()