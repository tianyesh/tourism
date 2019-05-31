import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/admin/login', data, 'POST');

/**
 * 注册
 */

export const register = data => fetch('/admin/register', data, 'POST');

/**
 * 退出
 */

export const singout = () => fetch('/admin/singout');

/**
 * 获取用户信息
 */

export const getUserInfo = () => fetch('/user/getUserInfo');

/*
* 获取用户列表
*/
export const getUserList = () => fetch('/user/getUserList');

/*
* 添加用户
*/
export const addUser = (data) => fetch('/user/addUser', data, 'POST');

/*
* 编辑用户
*/
export const editUser = (id, data) => fetch('/user/editUser/' + id, data, 'POST');

/*
* 删除用户
*/
export const delUser = (id) => fetch('/user/delUser/' + id, {}, 'DELETE');


/*
* 获取酒店列表
*/
export const getHotelList = (data) => fetch('/hotel/getHotelList', data);

/*
* 获取酒店详情
*/
export const getHotelDel = (id) => fetch('/hotel/getHotelDel/' + id);

/*
* 编辑酒店
*/
export const editHotel = (id, data) => fetch('/hotel/editHotel/' + id, data, 'POST');

/*
* 预订酒店
*/
export const bookHotel = (id, data) => fetch('/hotel/bookHotel/' + id, data, 'POST');

/*
* 获取酒店详情
*/
export const isCanComment = (id) => fetch('/hotel/isCanComment/' + id);

/*
* 添加酒店评论
*/
export const addHotelComment = (id, data) => fetch('/hotel/addHotelComment/' + id, data, 'POST');

/*
* 删除酒店
*/
export const delHotel = (id) => fetch('/hotel/delHotel/' + id, {}, 'DELETE');

/*
* 添加酒店
*/
export const addHotel = (data) => fetch('/hotel/addHotel', data, 'POST');

/*
* 获取省级列表
*/
export const getProvinceList = () => fetch('/city/getProvinceList');
/*
* 获取市级列表
*/
export const getCityList = (id) => fetch('/city/getCityList/' + id);

/*
* 获取景点列表
*/
export const getTravelList = (data) => fetch('/travel/getTravelList', data);

/*
* 获取酒店详情
*/
export const getTravelDel = (id) => fetch('/travel/getTravelDel/' + id);

/*
* 编辑景点
*/
export const editTravel = (id, data) => fetch('/travel/editTravel/' + id, data, 'POST');

/*
* 删除景点
*/
export const delTravel = (id) => fetch('/travel/delTravel/' + id, {}, 'DELETE');

/*
* 添加景点
*/
export const addTravel = (data) => fetch('/travel/addTravel', data, 'POST');


/*
* 获取景点评论状态
*/
export const isCanTravelComment = (id) => fetch('/travel/isCanTravelComment/' + id);

/*
* 添加景点评论
*/
export const addTravelComment = (id, data) => fetch('/travel/addTravelComment/' + id, data, 'POST');