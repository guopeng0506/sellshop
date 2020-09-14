<template>
	<div class="ratingselect">
		<div class="rating_tab">
			<div class="rating_type">
				<div @click="setType(2)" class="block rating_type2" :class="{'active':selectType===2}">{{desc.all}} <span class="text">{{ratings.length}}</span></div>
				<div @click="setType(0)" class="block rating_type0" :class="{'active':selectType===0}">{{desc.positive}} <span class="text">{{positives.length}}</span></div>
				<div @click="setType(1)" class="block rating_type1" :class="{'active':selectType===1}">{{desc.negative}} <span class="text">{{negatives.length}}</span></div>
			</div>
		</div>
		<div class="rating_text" :class="{'on':onlyContent}" @click="setIco">
			<span class="iconfont icon-success-fill"></span><span class="text">只看有内容的评价</span>
		</div>
		
	</div>
</template>

<script>
	export default {
		props : {
			ratings: {
				type:Array,
				default() {
					return []
				}
			},
			desc: {
				type:Object,
				default() {
					return {
						all:'全部',
						positive:'满意',
						negative:'不满意'
					}
				}
			}
		},
		data() {
			return {
				onlyContent:this.$store.state.raringOnlyContent,
				selectType:this.$store.state.raringSelectType //<!--selectType=2是全部，0是推荐，1是吐槽-->
			}
		},
		computed:{
//			<!--selectType=2是全部，0是推荐，1是吐槽-->
			positives() {
				return this.ratings.filter((raring)=>{
					return raring.rateType === 0;
				})
			},
			negatives() {
				return this.ratings.filter((raring)=>{
					return raring.rateType === 1;
				})
			}
		},
		methods: {
			setType(type) {
				this.selectType = type;
				
				this.$store.commit('setRaringType',type);
			},
			setIco(){
				this.onlyContent = !this.onlyContent;
				this.$store.commit('setRaringOnly',this.onlyContent);
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import "@/common/css/common.scss";
	
	.ratingselect{
		background: #fff;
		
		.rating_tab{
			padding: 18px 18px 0 18px;
			box-sizing: border-box;
			font-size:0;
			
			
			.rating_type{
				padding-bottom:18px;
				@include border-bottom_1px(rgba(7,17,27,.2));
				
				.text{
					font-size: 12px;
				}
				.block{
					display: inline-block;
					padding: 8px 12px;
					box-sizing: border-box;
					border-radius: 1px;
					font-size: 14px;
					margin-right: 8px;
					color:  rgb(77,85,93);
					
					&.active{
						color: #fff;
					}
					&.rating_type2{
						background: rgba(0,160,220,.2);
						&.active{
							background: rgb(0,160,220);
						}
					}
					&.rating_type0{
						background: rgba(0,160,220,.2);
						&.active{
							background: rgb(0,160,220);
						}
					}
					&.rating_type1{
						background: rgba(77,85,93,.2);
						&.active{
							background: rgb(77,85,93);
						}
					}
				}
			}
		}
		.rating_text{
			padding: 10px 18px;
			@include border-bottom_1px(rgba(7,17,27,.2));
			line-height: 24px;
			
			&.on{
				.icon-success-fill{
					color: #00c850;
				}
			}
			
			.icon-success-fill{
				font-size: 24px;
				color: rgb(147,153,159);
			}
			.text{
				font-size: 12px;
				color: rgb(147,153,159);
				vertical-align: top;
			}
		}
	}
	
</style>