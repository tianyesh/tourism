'use strict';

import CityModel from '../models/city'
import AddressComponent from '../prototype/addressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class City extends AddressComponent {
	constructor(){
		super()
  }
	async getProvinceList(req, res, next){
		try{
			const provinceList = await CityModel.find({}, '-_id -__v -sub').sort({name: -1})
			res.send({
				status: 1,
				data: provinceList,
			})
		}catch(err){
			console.log('获取省列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_PROVINCE_LIST',
				message: '获取省列表失败'
			})
		}
  }
  async getCityList(req, res, next){
    const province = req.params.province;
		try{
			const cityList = await CityModel.findOne({name:province}, '-_id')
			res.send({
				status: 1,
				data: cityList.sub,
			})
		}catch(err){
			console.log('获取市列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_CITY_LIST',
				message: '获取市列表失败'
			})
		}
	}
}

export default new City()