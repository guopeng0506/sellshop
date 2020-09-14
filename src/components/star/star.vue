<template>
	<div id="star" :class="starType">
		<span v-for="(item,index) in itemClass" :class="item" class="star-item" :key="index"></span>
	</div>
</template>

<script>
	const Numcount = 5
	const ITEMON = 'on'
	const ITEMOFF = 'off'
	const ITEMHALF = 'half'
	
export default {
	props : ['score','size'],//接收父级传过来的两个参数,score分数，size大小
 	data(){
	 	return{
	 	}
 	},
 	methods:{},
 	computed:{
	  	starType() {
	  		return 'star-' + this.size;
	  	},
	  	itemClass(){
	  		let starArr = [];
	  		
	  		let score = Math.floor(this.score * 2)/2;
	  		let has = score % 1 !== 0;
	  		let integr = Math.floor(score);
	  		
	  		for(let i = 0; i < integr; i++){
	  			starArr.push(ITEMON);
	  		}
	  		if(has){
	  			starArr.push(ITEMHALF);
	  		}
	  		
	  		if(starArr.length < Numcount){
	  			var a = Numcount-starArr.length;
	  			for(let i = 0; i < a; i++){
		  			starArr.push(ITEMOFF);
		  		}
	  		}
	  		return starArr;
	  	}
	}
}
</script>

<style lang="scss" scoped="scoped">
	@import "@/common/css/common.scss"; 

	#star{
		.star-item{
			display: inline-block;
		}
	}
	.star-24{
		.star-item{
			width: 10px;
			height: 10px;
			margin-right: 3px;
			&:last-child{
				margin-right: 0;
			}
			&.on{
				@include bg-Img('../../assets/star/star24_on@2x.png');
			}
			&.off{
				@include bg-Img('../../assets/star/star24_off@2x.png');
			}
			&.half{
				@include bg-Img('../../assets/star/star24_half@2x.png');
			}
		}
	}
	.star-36{
		.star-item{
			width: 15px;
			height: 15px;
			margin-right: 6px;
			&:last-child{
				margin-right: 0;
			}
			&.on{
				@include bg-Img('../../assets/star/star36_on@2x.png');
			}
			&.off{
				@include bg-Img('../../assets/star/star36_off@2x.png');
			}
			&.half{
				@include bg-Img('../../assets/star/star36_half@2x.png');
			}
		}
	}
	.star-48{
		.star-item{
			width: 20px;
			height: 20px;
			margin-right: 22px;
			
			&:last-child{
				margin-right: 0;
			}
			&.on{
				@include bg-Img('../../assets/star/star48_on@2x.png');
			}
			&.off{
				@include bg-Img('../../assets/star/star48_off@2x.png');
			}
			&.half{
				@include bg-Img('../../assets/star/star48_half@2x.png');
			}
		}
	}
	
</style>