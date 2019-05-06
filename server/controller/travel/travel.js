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
		try{
			const travelList = await TravelModel.find({}).sort({id: -1})
			res.send({
				status: 1,
				data: travelList,
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