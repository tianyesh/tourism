'use strict';

import mongoose from 'mongoose'
import travelData from '../../initdata/travel.js'
import dtime from 'time-formater'

const Schema = mongoose.Schema;

const travelSchema = new Schema({
	name: String,
	image_url: String,
  id: Number,
  score: Number,
  telephone: String,
	create_time: String,
  address: String,
  introduce: String,
  province: String,
  ticket_cost: Number,
  city: String,
  comment: [{
    comment_id: Number, // 评论id
    photo_url: String, // 评论头像
    user_name: String, // 用户名字
    user_id: Number, // 用户id
    score: Number, // 评分
    comment_time: String, // 评论时间
    status: Boolean, // 评论状态/true:可见/false:冻结
    describe: String, // 评论描述
    praise_num: Number // 被赞数
  }]
})

travelSchema.index({id: 1});

const Travel = mongoose.model('Travel', travelSchema);

Travel.findOne((err,data)=>{
	if(!data){
		travelData.forEach(item=>{
			const create_time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss');
      item.create_time = create_time;
      item.comment.forEach(items=>{
        const comment_time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss');
        items.comment_time = comment_time;
      })
			Travel.create(item);
		})
	}
})

export default Travel
