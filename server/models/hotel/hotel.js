'use strict';

import mongoose from 'mongoose'
import hotelData from '../../initdata/hotel.js'
import dtime from 'time-formater'

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
	name: String,
	image_url: String,
  id: Number,
  score: Number,
  telephone: String,
	create_time: String,
  address: String,
  introduce: String,
  province: String,
  city: String,
  sub_room: [{
    room_id: Number,
    image_url: String,
    room_name: String,
    wifi: Boolean,
    window: Boolean,
    hold_num: Number,
    area: Number,
    breakfast: Boolean,
    price: Number,
    surplus_num: Number
  }]
})

hotelSchema.index({id: 1});

const Hotel = mongoose.model('Hotel', hotelSchema);

Hotel.findOne((err,data)=>{
	if(!data){
		hotelData.forEach(item=>{
			const create_time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss');
			item.create_time = create_time;
			Hotel.create(item);
		})
	}
})

export default Hotel
