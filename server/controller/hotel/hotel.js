'use strict';

import HotelModel from '../../models/hotel/hotel'
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'

class Hotel extends AddressComponent {
	constructor(){
		super()
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
}

export default new Hotel()