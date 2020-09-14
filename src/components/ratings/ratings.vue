<template>
	<div class="ratings" ref="ratings">
		<div class="ratings_content" >
			<div class="synthesis_divide">
				<div class="divide">
					<div class="grade">{{headerData.score}}</div>
					<div class="name">综合评分</div>
					<div class="text">高于周边商家{{headerData.rankRate}}%</div>
				</div>
				<div class="star">
					<div class="service0">
						<span class="text">服务态度</span>
						<div class="name">
							<v-star :score="headerData.serviceScore" :size="size"></v-star>
						</div>
						<span class="serviceScore">{{headerData.serviceScore}}</span>
					</div>
					<div class="service1">
						<span class="text">商品评分</span>
						<div class="name">
							<v-star :score="headerData.foodScore" :size="size"></v-star>
						</div>
						<span class="foodScore">{{headerData.foodScore}}</span>
					</div>
					<div class="arrival_time">
						<span class="text">送达时间</span>
						<span class="time">{{headerData.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<div class="ratingselect">
				<v-ratingselect :ratings="ratingsData" ></v-ratingselect>
			</div>
			<div class="ratingsList">
				<ul>
					<li class="ratings_item" v-for="rating in ratingsData" v-if="needShow(rating.rateType,rating.text)">
						<img width="28" height="28" :src="rating.avatar" alt="" />
						<div  class="liContent">
							<div class="name">{{rating.username}}</div>
							<div class="star">
								<v-star :score="rating.score" :size="24"></v-star>
							</div>
							<span class="starTime">{{rating.deliveryTime}}分钟送达</span>
							<div class="text">{{rating.text}}</div>
							<div class="recommend">
								<div class="ico">
									<span v-if="rating.rateType === 1" class="iconfont icon-bad-fill"></span>
									<span v-if="rating.rateType === 0" class="iconfont icon-good-fill"></span>
								</div>
								<ul class="recommend_ul">
									<li class="recommend_li" v-for="recommend in rating.recommend">{{recommend}}</li>
								</ul>
							</div>
						</div>
						<div class="time">{{rating.rateTime | dateFormat}}</div>
					</li>
				</ul>
			</div>
			
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import BScroll from 'better-scroll';
	import {dateFormat} from '@/common/js/date';
	import ratingselect from '@/components/ratingselect/ratingselect';
	import star from '@/components/star/star';
	
	export default {
		components:{
			'v-ratingselect':ratingselect,
			'v-star':star
		},
		filters:{
			dateFormat(date){
				return dateFormat(date);
			}
		},
	 	data(){
		 	return{
		 		ratingsData:[],
		 		size:36,
	 			onlyContent:this.$store.state.raringOnlyContent,
				selectType:this.$store.state.raringSelectType
		 	}
	 	},
	 	computed:{
	 		headerData() {
				//获取header组件通过vuex存储的数据
				return this.$store.state.headerData != null?JSON.parse(this.$store.state.headerData):'';
			}
	 	},
	 	methods:{
	 		requestData() {
				this.$nextTick(() => {
					axios.get("/api/ratings").then((response) => {
						this.ratingsData = response.data.data;
						
						this.$nextTick(()=>{
							//初始化需要滚动的对象,
							if(!this.scroll){
								this.scroll = new BScroll(this.$refs.ratings, {click:true});
							}else{
								this.scroll.refresh();
							}
						})
						
					}).catch((err) => {
						console.log(err)
					})
				})
			},
			needShow(type,text){

				if(this.$store.state.raringOnlyContent && text == ''){
					return false;
				}
				//<!--type=2是全部，0是推荐，1是吐槽-->
				if(this.$store.state.raringSelectType == 2){
					return true
				}else{
					return type === this.$store.state.raringSelectType;
				}
			}
	 	},
	 	created() {
	 		this.requestData();
	 	}
	 	
	}
</script>

<style lang="scss" scoped>
@import "@/common/css/common.scss";

	.ratings{
		position: absolute;
	    top: 174px;
	    left: 0;
	    bottom: 0px;
	    width:100%;
	    overflow: hidden;
	    
		.ratings_content{
			background:#f3f5f7;
			
			.synthesis_divide{
				display: flex;
				padding: 18px 0;
				box-sizing: border-box;
				margin-bottom: 18px;
				background: #fff;
    			@include border-bottom_1px(rgba(7, 17, 27, 0.1));
    			
				.divide{
					flex: 0 0 137px;
					width:137px;
					text-align: center;
    				border-right: 1px solid rgba(7, 17, 27, 0.1);
    				
 					@media only screen and (max-width:320px){
 						flex: 0 0 120px;
						width:120px;
 					} 
    			
					.grade{
						font-size: 24px;
						color: rgb(255,153,0);
						line-height: 28px;
					}
					.name{
						padding: 6px 0 8px 0;
						font-size: 12px;
						color: rgb(7,17,27);
						line-height: 12px;
						font-weight: 700;
					}
					.text{
						font-size: 10px;
						color: rgb(147,153,159);
						line-height: 10px;
					}
				}
				.star{
					flex: 1;
					padding: 0 24px;
					box-sizing: border-box;
					font-size: 0;
					
					@media only screen and (max-width:320px){
 						padding: 0 5px;
 					}
					
					.service0{
						.name{
							display: inline-block;
							vertical-align: top;
						}
						.text{
							font-size: 12px;
							color: rgb(7,17,27);
							line-height: 18px;
							padding-right: 12px;
							vertical-align: top;
						}
						.serviceScore{
							font-size: 12px;
						    padding-left: 12px;
						    line-height: 18px;
						    vertical-align: top;
						    color: rgb(255,153,0);
						    font-weight: 700;
						}
					}
					.service1{
						margin: 8px 0;
						
						.name{
							display: inline-block;
							vertical-align: top;
						}
						.text{
							font-size: 12px;
							color: rgb(7,17,27);
							line-height: 18px;
							padding-right: 12px;
							vertical-align: top;
						}
						.foodScore{
							font-size: 12px;
						    padding-left: 12px;
						    line-height: 18px;
						    vertical-align: top;
						    color: rgb(255,153,0);
						    font-weight: 700;
						}
					}
					.arrival_time{
						.text{
							font-size: 12px;
							color: rgb(7,17,27);
							line-height: 18px;
							padding-right: 12px;
						}
						.time{
							font-size: 12px;
							color: rgb(147,153,159);
							line-height: 18px;
						}
					}
				}
			}
		}
		.ratingselect{
			background: #fff;
    		@include border-top_1px(rgba(7, 17, 27, 0.1));
		}
		.ratingsList{
			background: #fff;
			padding: 0 18px;
			box-sizing: border-box;
			
			.ratings_item{
				padding: 18px 0;
				@include border-bottom_1px(rgba(7, 17, 27, 0.1));
				padding-left:40px;
				
				img{
					position: absolute;
					top:18px;
					left: 0;
					border-radius: 50%;
				}
				.liContent{
					
					.name{
						font-size: 10px;
						color: rgb(7,17,27);
						line-height: 12px;
					}
					.star{
						display: inline-block;
						padding: 4px 6px 6px 0;
					}
					.starTime{
						font-size: 10px;
						font-weight: 200;
						color: rgb(147,153,159);
						line-height: 12px;
					}
					.text{
						font-size: 12px;
						color: rgb(7,17,27);
						line-height: 18px;
					}
					.recommend{
						display: flex;
						font-size: 0;
						
						.ico{
							flex: 0 0 12px;
							margin-top:8px;
							
							.icon-good-fill{
								font-size: 12px;
								color: rgb(0,160,220);
								line-height: 16px;
							}
							.icon-bad-fill{
								font-size: 12px;
								color: rgb(147,153,159);
								line-height: 16px;
							}
						}
						.recommend_ul{
							flex: 1;
							
							.recommend_li{
								font-size: 9px;
								display: inline-block;
								padding: 0 6px;
								color: rgb(147,153,159);
								line-height: 16px;
								border-radius: 1px;
								border:1px solid rgba(7,17,27,.1);
								margin-left: 6px;
								width: 60px;
								text-align: center;
								@include font-text-overflow();
								margin-top: 8px;
							}
						}
						
					}

				}
				.time{
					position: absolute;
					right: 0;
					top: 18px;
					font-size:10px;
					font-weight: 200;
					color: rgb(147,153,159);
					line-height: 12px;
				}
			}
		}
	}
	
	
</style>