import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	}
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
			// console.log(err.message)
		}
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
