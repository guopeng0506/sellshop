<template>
	<div id="linkTitle">
		<div class="link-item"></div>
		<div class="link-title">{{title}}</div>
		<div class="link-item"></div>
	</div>
</template>

<script>
	
export default {
	props : ['title'],//接收父级传过来的参数
 	data(){
	 	return{
	 	}
 	},
 	methods:{},
 	computed:{
	  	
	}
}
</script>

<style lang="scss" scoped="scoped">
	
	#linkTitle{
		display: flex;
		width: 80%;
		
		.link-item{
			flex: 1;
			position: relative;
			top: -6px;
			border-bottom: 1px solid rgba(255,255,255,.2);
		}
		.link-title{
			margin: 0 12px;
			font-weight: 600;
		}
	}
	
	
	
</style>