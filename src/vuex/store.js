import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


//vuex中作为存储的数据
const state  = {
	headerData:sessionStorage.getItem('headerData'),
	sellFodds:[],
	count:0,
	goodsData:'',
	raringSelectType:2,//raringSelect组件参数，tab点击
	raringOnlyContent:false,//raringSelect组件参数，只看有内容
	collectType:false,//商家收藏标识
}

//修改数据
const mutations = {
	//存储header的数据
	setHeaderData(state,data){
		state.headerData = data;
		sessionStorage.setItem('headerData',data);
	},
	//存储购物选中的数据，防止刷新页面被清空
	sellFoddsData(state,data){
		state.count = 0;//标识
		state.sellFodds.push(data);
		
		//去重
//		if(state.sellFodds != ''){
//			let mu = state.sellFodds.find((n) => n.id == data.id);
//		    if(mu){
//		    	console.log(++mu.count)
//		        return;
//		    }else{
//		        state.sellFodds.push(data);
//		    }
//		}else{
//			state.sellFodds.push(data);
//		}
	},
	setGoodsData(state,data){
		state.goodsData = data;
	},
	incCount(state,data){
		state.count = data;
	},
	setRaringType(state,data){
		state.raringSelectType = data;
	},
	setRaringOnly(state,data){
		state.raringOnlyContent = data;
	},
	setCollect(state,data){
		state.collectType = data;
	}
}
//this.$store.commit('sellFoddsData',this.foods);
//this.$store.state.sellFoddsData
//有点类型计算属性， 改变state里面count数据的时候就是触发 getters里面的方法
const getters = {
//	computed:(state) => {
//		return state.count*2
//	}
}

//实例化
const store = new Vuex.Store({
	state,
	getters,
	mutations:mutations
})

//抛出
export default store

