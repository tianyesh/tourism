'use strict';

import AdminModel from '../../models/admin/admin'
import AddressComponent from '../../prototype/addressComponent'

class User extends AddressComponent {
	constructor(){
    super()
	}
	async getUserList(req, res, next){
		const {limit = 10, offset = 0} = req.query;
		try{
			const userList = await AdminModel.find({}, '-_id -password -__v').sort({id: -1}).skip(Number(offset)).limit(Number(limit))
			res.send({
				status: 1,
				data: userList,
			})
		}catch(err){
			console.log('获取用户列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_USER_LIST',
				message: '获取用户列表失败'
			})
		}
  }
  async delUser(req, res, next){
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
			await AdminModel.remove({id: id});
			res.send({
				status: 1,
				success: '删除用户成功',
			})
		}catch(err){
			console.log('删除用户失败', err);
			res.send({
				status: 0,
				type: 'DELETE_USER_FAILED',
				message: '删除用户失败',
			})
		}
	}
}

export default new User()