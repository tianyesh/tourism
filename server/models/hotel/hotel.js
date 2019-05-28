'use strict';

import mongoose from 'mongoose'
import hotelData from '../../initdata/hotel.js'
import dtime from 'time-formater'

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
	name: String, // 酒店名称
	image_url: String, // 酒店图片
  id: Number, // 酒店id
  score: Number, // 酒店评分
  telephone: String, // 酒店电话
	create_time: String, // 创建时间
  address: String, // 详细地址
  introduce: String, // 酒店介绍
  province: String, // 所在省份
  city: String, // 所在城市
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
  }],
  sub_room: [{
    room_id: Number, // 房间id
    image_url: String, // 房间图片
    room_name: String, // 房间名称
    wifi: Boolean, // 是否有可上网
    window: Boolean, // 是否有窗
    hold_num: Number, // 可居住人数
    area: Number, // 房间面积
    breakfast: Boolean, // 是否有早餐
    price: Number, // 价格
    surplus_num: Number // 所剩房间数
  }]
})

hotelSchema.index({id: 1});

const Hotel = mongoose.model('Hotel', hotelSchema);

Hotel.findOne((err,data)=>{
	if(!data){
		hotelData.forEach(item=>{
			const create_time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss');
      item.create_time = create_time;
      item.comment.forEach(items=>{
        const comment_time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss');
        items.comment_time = comment_time;
      })
			Hotel.create(item);
		})
	}
})

export default Hotel
