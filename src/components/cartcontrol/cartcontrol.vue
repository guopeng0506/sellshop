<template>
	<div id="cartcontrol">
		<transition  name="move">
			<div class="calssreduce iconfont icon-reduce" v-show="foods.count > 0" @click.stop.prevent="reduce">	</div>
		</transition>
		<div class="count" v-show="foods.count > 0">{{foods.count}}</div>
		<div class="iconfont icon-add-fill" @click.stop.prevent="add"></div>
	</div>
</template>

<script>
	
	export default {
		props : ['foods'],
		data() {
			return {
			}
		},
		methods:{
			add(event) {
				this.foods.count++
				this.$emit('cartAdd',event.target);
				
//				this.$store.commit('sellFoddsData',this.foods);
			},
			reduce() {
				this.foods.count--;
//				this.$store.state.sellFoddsData.splice(ind,1)
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#cartcontrol{
		div,span{
			display: inline-block;
		}
	    .icon-add-fill{
	    	font-size: 24px;
			color:rgb(0,160,220);
			padding: 6px;
			line-height: 24px;
	    }
	    /*开始*//*生效*/
	    .move-enter,.move-leave-to{
    		opacity: 0;
    		transform: rotate(0deg);
    	}
 
    	.move-enter-active{
    		transition: all .45s line-height;
    		transform: translate3d(0,0,0);
    		transform: rotate(-180deg);
    	}
    	/*离开过渡生效时*/
    	.move-leave-active{
    		opacity: 1;
    		transition: all .45s line-height;
    		transform: translate3d(24px,0,0);
    		transform: rotate(180deg);
    	}
	    .calssreduce{
	    	padding: 6px;
	    	font-size: 24px;
			color:rgb(0,160,220);
			line-height: 24px;
	    }
	    .count{
	    	font-size: 10px;
	    	color:rgb(147,153,159);
	    	padding: 0;
	    	/*vertical-align: top;*/
	    	position: relative;
    		top: -4px;
    		width: 12px;
    		text-align: center;
	    }
	  
	}
</style>