'use strict';

import mongoose from 'mongoose'
import cityData from '../initdata/city.js'
import dtime from 'time-formater'

const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: String,
  type: Number,
  sub: [{
    name: String
  }]
})

citySchema.index({name: 1});

const City = mongoose.model('City', citySchema);

City.findOne((err,data)=>{
	if(!data){
		cityData.forEach(item=>{
			City.create(item);
		})
	}
})

export default City
