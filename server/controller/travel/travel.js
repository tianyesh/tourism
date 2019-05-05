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
	}
	async editTravel(req, res, next){
	}
	async delTravel(req, res, next){
	}
}

export default new Travel()