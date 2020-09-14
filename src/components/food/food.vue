<template>
	<transition  name="food">
	<div id="food" v-show="foodShow" ref="food">
		<div>
			<div class="commodity">
				<div class="logo">
					<div class="foodhide" @click="foodsHide"><span class="iconfont icon-arrow-lift"></span></div>
					<img width="100%" height="100%" :src="food.image" alt="" />
				</div>
				<div class="content">
					<h1 class="name">{{food.name}}</h1>
					<div class="extra">
						<span class="sellCount">月销量{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="icon iconfont  icon-rmb"></span><span class="text">{{food.price}}</span>
						<span class="oldPrice" v-if="food.oldPrice"><span class="oldPriceIcon iconfont  icon-rmb"></span>{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol">
						<v-cartcontrol @cartAdd="cart_Add"  :foods="food"></v-cartcontrol>
					</div>
					<transition  name="buy" >
						<div @click="addFirst" class="buy" v-if="!food.count || food.count===0">加入购物车</div>
					</transition>
				</div>
			</div>
			<div class="introduce">
				<h1 class="name">商品介绍</h1>
				<p class="text">{{food.info}}</p>
			</div>
			<div class="comment">
				<h1 class="name">商品评价</h1>

				<v-ratingselect :ratings="food.ratings" :desc="desc"></v-ratingselect>
				
				<div class="rating_comment">
					<ul>
						<li class="rating_item" v-for="rating in food.ratings" v-if="needShow(rating.rateType,rating.text)">
							<div class="rateTime">{{rating.rateTime | dateFormat}}</div>
							<div class="icon">
								<span v-if="rating.rateType === 1" class="iconfont icon-bad-fill"></span>
								<span v-if="rating.rateType === 0" class="iconfont icon-good-fill"></span>
								<span class="text">{{rating.text !=""?rating.text:'用户很懒，暂无评价'}}</span>
							</div>
							<div class="user">
								<span class="text">{{rating.username}}</span>
								<img width="12" height="12" :src="rating.avatar" />
							</div>
						</li>
						<!--<div class="no-rating" v-if="food.ratings.length == 0">暂无评价</div>-->
					</ul>
				</div>
			</div>
			
		</div>
	</div>
	</transition>
</template>

<script>
	import BScroll from 'better-scroll';
	import Vue from 'vue';
	import {dateFormat} from '@/common/js/date';
	import cartcontrol from '@/components/cartcontrol/cartcontrol';//添加删除购物车
	import ratingselect from '@/components/ratingselect/ratingselect';
	
	export default {
		components:{
			'v-cartcontrol':cartcontrol,
			'v-ratingselect':ratingselect
		},
		props : ['food'],//接收父级goods传过来的参数,商品li用来计算总价,
		filters:{
			dateFormat(date){
				return dateFormat(date);
			}
		},
		data() {
			return {
				onlyContent:this.$store.state.raringOnlyContent,
				selectType:this.$store.state.raringSelectType,
				foodShow:false,
				desc:{
					all:'全部',
					positive:'推荐',
					negative:'吐槽'
				}
				
			}
		},
		methods:{
			foodsShow() {
				this.foodShow = true;
				this.$nextTick(()=>{
					//初始化需要滚动的对象,
					if(!this.scroll){
						this.scroll = new BScroll(this.$refs.food, {click:true});
					}else{
						this.scroll.refresh();
					}
				})
			},
			foodsHide() {
				this.foodShow = false;
			},
			addFirst(event) {
				
				this.$emit('cartAdd',event.target);
				//因为一开始是没有food，所以Vue.set
				Vue.set(this.food,'count',1);
			},
			cart_Add() {
				this.$emit('cartAdd',event.target);
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
			
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "@/common/css/common.scss";
	
	#food{
		position:fixed;
		left:0;
		top:0;
		bottom:64px;
		background:#f3f5f7;
		z-index: 30;
		width: 100%;
		transition: all .2s linear;
		transform: translate3d(0,0,0);
		    
		.commodity{
			margin-bottom:18px;
			background:#fff;
			@include border-bottom_1px(rgba(7,17,27,.2))
			
			.logo{
				position: relative;
				width: 100%;
				height: 0;
				padding-top:100%;
				
				img{
					position: absolute;
					top:0;
					left: 0;
				}
				
				.foodhide{
					position: absolute;
				    top: 10px;
				    left: 10px;
				    background: rgba(7,17,27,.2);
				    color: #fff;
				    border-radius: 50%;
    				padding: 10px;
    				z-index: 1;
				}
			}
			
			.content{
				padding: 18px;
				box-sizing: border-box;
				
				.name{
					font-size: 16px;
					line-height: 16px;
					font-weight: 700;
					color: rgb(7,17,27);
				}
				.extra{
					padding: 8px 0 18px 0;
					font-size: 10px;
					line-height: 10px;
					color: rgb(174,153,158);
					
					.sellCount{
						margin-right: 12px;
					}
				}
				.price{
					.icon,.text {
						font-size: 16px;
						color: rgb(240,20,20);
						font-weight: 700;
						line-height: 24px;
					}
					.oldPrice,.oldPriceIcon{
						text-decoration: line-through;
						color: rgb(174,153,158);
						font-size: 10px;
					}
				}
				.cartcontrol{
					position: absolute;
				    right: 12px;
				    bottom: 12px;
				}
				.buy{
					position: absolute;
				    right: 18px;
				    bottom: 18px;
				    width: 74px;
				    height: 24px;
				    box-sizing: border-box;
				    background: rgb(0,160,220);
				    border-radius: 12px;
				    text-align: center;
					font-size: 10px;
					color: #fff;
					opacity: 1;
					line-height: 24px;
					transition: all .3s line-height;
				}
				.buy-enter,.buy-leave-active{
					opacity: 0;
					transition: all .3s line-height;
				}
			}
		}
		.introduce{
			margin-bottom:18px;
			background:#fff;
			@include border-bottom_1px(rgba(7,17,27,.2));
			@include border-top_1px(rgba(7,17,27,.2));
			padding: 18px;
			box-sizing: border-box;
			
			.name{
				font-size: 16px;
				line-height: 16px;
				font-weight: 300;
				color: rgb(7,17,27);
			}
			.text{
				padding:6px 8px 0 8px;
				font-size: 12px;
				line-height: 24px;
				font-weight: 200;
				color: rgb(77,85,93);
			}
		}
		.comment{
			background:#fff;
			padding: 18px 0;
			box-sizing: border-box;
			@include border-top_1px(rgba(7,17,27,.2));
			
			.name{
				font-size: 16px;
				line-height: 16px;
				font-weight: 300;
				color: rgb(7,17,27);
				padding: 0 18px;
			}
			
			.rating_comment{
				padding: 0 18px;
				
				.rating_item{
					padding: 16px 0;
					box-sizing: border-box;
					@include border-bottom_1px(rgba(7,17,27,.2));
					
					.rateTime{
						font-size: 10px;
						color: rgb(147,153,159);
						line-height: 12px;
					}
					.icon{
						padding: 5px 0 0px 0;
						box-sizing: border-box;
						
						.icon-good-fill{
							font-size: 12px;
							color: rgb(0,160,220);
							line-height: 24px;
						}
						.icon-bad-fill{
							font-size: 12px;
							color: rgb(147,153,159);
							line-height: 24px;
						}
						.text{
							font-size: 12px;
							color: rgb(7,17,27);
							line-height: 16px;
						}
					}
					.user{
						position: absolute;
						right: 0px;
						top:16px;
						
						.text{
							font-size:10px;
							color: rgb(147,153,159);
							line-height: 12px;
						}
						img{
							border-radius: 50%;
						}
					}
					
				}
				.no-rating{
					font-size: 12px;
					color: rgb(147,153,159);
					padding: 10px 0;
				}
			}
			
		}
		
	}
	
	.food-enter,.fold-leave-active{
		transform: translate3d(100%, 0, 0);
	}

	
</style>