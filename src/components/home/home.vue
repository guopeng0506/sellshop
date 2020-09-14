<template>
	<div id="home">
		 <v-heade></v-heade> 
		
		<div class="tab">
			<div class="item" ><router-link to="/goods">商品</router-link></div>
			<div class="item"><router-link to="/ratings">评论</router-link></div>
			<div class="item"><router-link to="/seller">商家</router-link></div>
		</div> 
		
		<div class="content">
			<keep-alive><!-- 路由跳转不销毁，保留上个路由的一些状态数据 -->
			<router-view></router-view>
			</keep-alive>
		</div>
	</div>
</template>

<script>
	 import heade from '@/components/header/header';
	
	export default {
		name:'home',
		components:{
			'v-heade':heade
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import "@/common/css/common.scss";
	
	.tab{
		display: flex;
		width: 100%;
		height: 40px;
		text-align: center;
		line-height: 40px;
		position: relative;
	}
	.tab{
		@include border-bottom_1px(rgba(7,17,27,0.1));
	}
	.tab .item{
		flex: 1;
	}
	.tab .item a{
		color:rgb(77,85,93);
		font-size: 14px;
		display: block;
	}
	.tab .item .router-link-active{
		color: brown;
	}
</style>