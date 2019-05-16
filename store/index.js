import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
	provinceInfo: ''
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	},
	changeProvince(state, province){
		state.provinceInfo = province;
		localStorage.setItem('province', province);
	},
}

const actions = {
	async getAdminData({commit}){
		try{
			const res = await getUserInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			}else{
				commit('saveAdminInfo', {});
			}
		}catch(err){
			console.log(err.message)
		}
	},
	setProvince(context, province){
		context.commit('changeProvince', province);
	}
}

const creatStore = () => {
  return new Vuex.Store({
    state,
    actions,
    mutations,
  })
}

export default creatStore
