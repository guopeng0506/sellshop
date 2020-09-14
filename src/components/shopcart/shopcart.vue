<template>
	<div id="shopcart">
		<div class="content" >
			<div class="shopcart_left" @click="toggleList">
				<div class="shopcart_logo">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<span class="icon iconfont icon-cart-full-fill" :class="{'highlight':totalCount>0}"></span>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="shopcart_price">
					<div class="price" :class="{'highlight':totalPrice>0}">
						<span class="icon iconfont icon-rmb"></span><span class="text">{{totalPrice}}</span>
					</div>
				</div>
				<div class="shopcart_shippingFee">
					<div class="shippingFee">
						<span class="text">另需配送费</span><span class="icon iconfont icon-rmb"></span><span class="text">{{headerData.deliveryPrice}} 元</span>
					</div>
				</div>
			</div>
			<div class="shopcart_right">
				<div class="accounts" :class="MinPrice" v-html="totalMinPrice" @click="pay"></div>
			</div>
			
			<!--购物车详情-->
			<transition  name="fold">
				<div class="shopcart_list" v-show="listshow">
					<div class="shopcart_head">
						<span class="title">购物车</span>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="shopcart_content" ref="shopcart_content">
						<ul>
							<li class="fold_li" v-for="food in sellFoods" :key="food.name" v-if="food.count >0">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span class="icon iconfont icon-rmb"></span><span class="text">{{food.price * food.count}}</span>
								</div>
								<div class="cart">
									<v-cartcontrol  @cartAdd="cart_Add" :foods="food"></v-cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
			<transition  name="mask">
				<div @click="toggleList" class="list-mask"  v-show="listshow"></div>
			</transition>
		</div>
		
		<!--购物车小球-->
		<div class="ball-container">
			<transition-group  
				name="drop" 
				@before-enter="beforeEnter"
		        @enter="enter"
		        @after-enter="afterEnter">
		        
				<div class="ball" v-for="(ball,index) in balls" :key="ball.name" v-show="ball.show">
					<div class="inner inner_hook drop-item"></div>
				</div>
			</transition-group>
		</div>
		
	</div>
</template>

<script>

	import BScroll from 'better-scroll';
	import Bus from '@/common/js/bus.js'//公共传值js
	import cartcontrol from '@/components/cartcontrol/cartcontrol';//小球购物车
	
	export default {
		components:{
			'v-cartcontrol':cartcontrol
		},
		props : {//接收父级goods传过来的参数,商品li用来计算总价,
			sellFoods:{
				type:Array,
				default() {
			        return []//{count:1,price:10}
			    }
			}
		},
		data() {
			return {
				foodList:true,
				balls:[
					{
						show:false,
						name:'0'//name做key
					},{
						show:false,
						name:'1'
					},{
						show:false,
						name:'2'
					},{
						show:false,
						name:'3'
					},{
						show:false,
						name:'4'
					}
				],
				dropBall:[],//记录下落的球，
				options: {
					click: true
				}
			}
		},
		methods:{
			cart_Add(el_target){//接收cartcontrol$emit过来的add-dom
				//优化体验 ，异步执行动画
				this.$nextTick(()=>{
					this.drop(el_target);
				})
			},
			drop(el){
				for (var i=0; i < this.balls.length;i++){
					let ball = this.balls[i];

					if(!ball.show){
						ball.show = true;
						//el把dom存起来
						ball.el = el;
						this.dropBall.push(ball);
					
					}
				}
			},
			beforeEnter(el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
//						获取el在视口的高度
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left-32;
						let y = -(window.innerHeight - rect.top-22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner_hook')[0];

						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el) {
				/*eslint-disable no-unused-vars*/
				let rf = el.offsetHeight;
				this.$nextTick(()=>{
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform ='translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner_hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
				})
			},
			afterEnter(el) {
				//把push进去下落的球，display：none
				let ball = this.dropBall.shift();

				if(ball){
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList() {//购物车详情显示隐藏
				if(!this.totalCount){
					return;
				}
				this.foodList = !this.foodList;
			},
			empty() {//清空
				this.sellFoods.forEach((foods)=>{
					foods.count = 0;
				})
			},
			pay() {//结算
				if(this.totalPrice < this.minPrice){
					return;
				}
				
				alert(`成功支出${this.totalPrice}元`)
			}	
		},
		computed:{
			totalCount() {//总数量
				let count = 0;

				this.sellFoods.forEach((foods)=>{
					count += foods.count;
				})

				return count;
			},
			totalPrice() {//总价格
				let count = 0;
				
				this.sellFoods.forEach((foods)=>{
					count += foods.count * foods.price;
				})
				return count;
			},
			totalMinPrice() {//起送结算
				
				if(this.totalPrice === 0){
					return `<span style="font-size:12px;font-weight: 700;" class="iconfont icon-rmb"></span>${this.headerData.minPrice}元起送`;
				}else if(this.totalPrice < this.headerData.minPrice){
					return `还差<span style="font-size:12px;font-weight: 700;" class="iconfont icon-rmb"></span>${this.headerData.minPrice -this.totalPrice}起送`;
				}else{
					return '去结算';
				}
			},
			headerData() {
				//获取header组件通过vuex存储的数据
				return this.$store.state.headerData != null?JSON.parse(this.$store.state.headerData):'';
			},
			MinPrice() {//控制结算高亮class
				if(this.totalPrice >= this.headerData.minPrice){
					return 'highlight';
				}else {
					return '';
				}
			},
			listshow() {//购物车显示隐藏
				if(!this.totalCount){
					this.foodList = true;
					return false;
				}
				
				let show = !this.foodList;
			
				if(show){
					this.$nextTick(()=>{
						if(!this.scroll) {
							this.scroll = new BScroll(this.$refs.shopcart_content, this.options);
						}else{
							this.scroll.refresh() //重新计算元素高度
						}
					})
				}
				return show;
			}
		},
		mounted(){
			  
		},
		created() {
			
			
			//保存购物车选中状态
//			if(this.$store.state.count == 1){
//				let getFoods = this.$store.state.sellFodds;
//				this.sellFoods.push(getFoods)
//				alert()

//				alert()
//				this.$store.commit('setGoodsData',food);
//					
//				console.log(getFoods)
//				console.log(this.sellFoods)
//			}
		}
	}
</script>

<style lang="scss" scoped="scoped">

	@import "@/common/css/common.scss";
	
	
	#shopcart{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 48px;
		z-index: 50;
		
		.content{
			display: flex;
			height: 48px;
			font-size: 0;
			font-weight:700;
			color:rgba(255,255,255,.4);
			background: #141d27;
			z-index: 50;
			
			.shopcart_left{
				flex: 1;	
				
				.shopcart_logo{
					display: inline-block;
					position: relative;
					top: -9px;
					width: 56px;
					height: 56px;
					margin: 0 12px;
					padding: 6px;
					box-sizing: border-box;
					vertical-align: top;
					background: #141d27;
					border-radius: 50%;
					
					.logo{
					    height: 100%;
					    text-align: center;
					    border-radius: 50%;
						background:#2b343c;
						
						&.highlight{
							background: rgb(0,160,220);
						}
						
						.icon{
							line-height: 44px;
					    	font-size: 24px;
					    	font-weight: 700;
					    	
					    	&.highlight{
								color: #fff;
							}
						}
					}
					
					.num{
						position: absolute;
						top: 0;
						right: 0;
						width: 24px;
						height: 16px;
						font-size: 9px;
						font-weight: 700;
						background: rgb(240,20,20);
						box-shadow: 0px 4px 8px 0px rgba(0,0,0,.4);
						line-height: 16px;
						color: #fff;
						text-align: center;
						border-radius: 16px;
					}
				}
				.shopcart_price{
					display: inline-block;
					vertical-align: top;
					padding-right: 12px;
				    font-size: 16px;
				    font-weight: 700;
				    margin-top: 12px;
				    line-height:24px;
    				box-sizing: border-box;
    				border-right: 1px solid rgba(255,255,255,.1);
    					
					.price{
						&.highlight{
							color: #fff;
						}
    					.icon{
					    	font-weight: 700;
					    }
					}
				}
				.shopcart_shippingFee{
					display: inline-block;
					vertical-align: top;
					padding: 0 0 0 12px;
					box-sizing: border-box;
					line-height: 48px;
					
					.shippingFee{
					    
					    .text{
					    	font-size: 10px;
					    	line-height: 48px;
					    }
					    .icon {
							font-size: 10px;
						}
					}
				}
			}
			.shopcart_right{
				flex: 0 0 105px;
				width: 105px;
				background:#2b343c;
				
				.accounts{
				    text-align: center;
				    padding:0 8px;
				    line-height:48px;
				    box-sizing: border-box;
				    font-size:12px;
					font-weight: 700;
					
					&.highlight{
						background: #00b43c;
						color: #fff;
						font-size: 14px;
					}
					
				}
			}
			.shopcart_list{
				position: absolute;
				top: 0px;
				left: 0px;
				z-index: -1;
				width: 100%;
				transition: all .5s;
				transform: translate3d(0,-100%,0);
								
				.shopcart_head{
					height: 40px;
					line-height: 40px;
					background: #f3f5f7;
					padding: 0 18px;
					border-bottom:1px solid rgba(7,17,27,0.1);
					
					.title{
						font-size: 14px;
						font-weight: 200;
						color: rgb(7,17,27);
					}
					.empty{
						font-size: 12px;
						font-weight: 200;
						color: rgb(0,160,220);
						float: right;
					}
				}
				.shopcart_content{
					max-height: 217px;
					padding: 0 18px;
					background: #fff;
					overflow: hidden;
					
					.fold_li{
						padding: 12px 0;
						box-sizing: border-box;
						@include border-bottom_1px(rgba(7,17,27,0.1))
						
						.name{
    						font-size: 14px;
    						line-height: 24px;
    						color: rgb(7,17,27);
						}
						.price{
							position: absolute;
							right: 90px;
							bottom: 6px;
							line-height: 24px;
							
							.icon,.text{
								color: rgb(240,20,20);
	    						font-size: 14px;
	    						font-weight: 700;
							}
						}
						.cart{
							position: absolute;
							right: 0px;
							bottom: 6px;
    						
						}
					}
				}
			}
			
			.fold-enter,.fold-leave-active{
				transform: translate3d(0,0,0);
			}
			
			.list-mask{
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: -2;
				opacity: 1;
				background: rgba(7,17,27,0.75);
				backdrop-filter:blur(10px);
				transition: all .5s;
				/*filter: blur(10px);*/
			}
			.mask-enter,.mask-leave-active{
				opacity: 0;
				transition: all .5s;
			}
		}
		
		.ball-container{
			.ball{
				position: fixed;
				left: 32px;
				bottom: 22px;
				z-index: 200;
				
				.drop-item{
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: rgb(0,160,220);
					transition: all .4s cubic-bezier(0.42,0,1,1);
				}
				
			}
			.drop-enter-active,.drop-leave-active{
				transition: all 0.4s cubic-bezier(0.49,-0.15,0.75,0.41);
			}
		}
		
	}
</style>