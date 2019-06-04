'use strict';

import TravelModel from '../../models/travel/travel'
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Travel extends AddressComponent {
	constructor(){
		super()
		this.addTravel = this.addTravel.bind(this)
  }
	async getTravelList(req, res, next){
		const {offset=0, limit=10, orderType='0', province} = req.query;
		let orderObj = {
			'0': {id: -1},
			'1': {score: -1}
		}
		try{
			const travelList = await TravelModel.find({province: province}).sort(orderObj[orderType]).limit(parseInt(limit)).skip(parseInt(offset))
			const total = await TravelModel.find({province: province}).sort(orderObj[orderType]).count()
			res.send({
				status: 1,
				data: travelList,
				total: total
			})
		}catch(err){
			console.log('获取列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_LIST',
				message: '获取列表失败'
			})
		}
	}
	async getTravelDel(req, res, next){
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
			const travel = await TravelModel.findOne({id});
			res.send({
				status: 1,
				data: travel
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
	async addTravelComment(req, res, next){
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
				let travel = await TravelModel.findOne({id});
				let comment = travel.comment;
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
				travel = await TravelModel.findOneAndUpdate({id}, {$set: { score: newScore, comment}});
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
	async bookTravel(req, res, next) {
		// const id = req.params.id;
		// if (!id || !Number(id)) {
		// 	console.log('id参数错误', id)
		// 	res.send({
		// 		status: 0,
		// 		type: 'ERROR_ADMINID',
		// 		message: 'id参数错误',
		// 	})
		// 	return 
		// }
		// const form = new formidable.IncomingForm();
		// form.parse(req, async (err, fields, files) => {
		// 	if (err) {
		// 		console.log('获取form出错', err);
		// 		res.send({
		// 			status: 0,
		// 			type: 'ERROR_FORM',
		// 			message: '表单信息错误',
		// 		})
		// 		return 
		// 	}
		// 	const {room_id,surplus_num} = fields;
		// 	try{
		// 		const hotel = await HotelModel.update({id:id,'sub_room.room_id':room_id}, {$set: {'sub_room.$.surplus_num': surplus_num}});
		// 		res.send({
		// 			status: 1,
		// 			success: '修改成功',
		// 		})
		// 	}catch(err){
		// 		console.log(err.message, err);
		// 		res.send({
		// 			status: 0,
		// 			type: 'ERROR_UPDATE',
		// 			message: '更新失败',
		// 		})
		// 	}
		// })
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
			const travel = await TravelModel.findOne({id});
			const comment = travel.comment;
			let isCanComment = false;
			console.log('user_id:'+user_id)
			console.log('id:'+id)
			console.log('comment:'+JSON.stringify(comment))
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
	async addTravel(req, res, next){
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
			const {name, introduce, province='北京', city='北京', address, score, image_url, ticket_cost, telephone, comment = []} = fields;
			console.log(JSON.stringify(fields))
			try{
				if (!name) {
					throw new Error('名错误')
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
				const travel = await TravelModel.findOne({name})
				if (travel) {
					console.log('已经存在');
					res.send({
						status: 0,
						type: 'HAS_EXIST',
						message: '已经存在',
					})
				}else{
					const travel_id = await this.getId('travel_id');
					const newTravel = {
						name, 
						introduce,
						province,
						city,
						address,
						telephone,
						id: travel_id,
						score,
						ticket_cost,
						image_url,
						create_time: dtime(new Date()).format('YYYY-MM-DD HH:mm:ss')
					}
					await TravelModel.create(newTravel)
					res.send({
						status: 1,
						message: '添加成功'
					})
				}
			}catch(err){
				console.log('添加失败', err);
				res.send({
					status: 0,
					type: 'REGISTER_FAILED',
					message: '添加失败',
				})
			}
		})
	}
	async editTravel(req, res, next){
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
				const travel = await TravelModel.findOneAndUpdate({id}, {$set: newData});
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
	async delTravel(req, res, next){
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
			await TravelModel.remove({id: id});
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

export default new Travel()