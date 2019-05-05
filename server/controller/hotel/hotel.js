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
		try{
			const hotelList = await HotelModel.find({}).sort({id: -1})
			res.send({
				status: 1,
				data: hotelList,
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