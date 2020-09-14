<template>	
	<div id="goods">

		<div class="menu" ref="menuwrapper" :scrollbar="options.scrollbar" :startY="options.startY">
			<ul class="menu_ul">
				<li class="menu_li" v-for="(item,index) in goddsData" :key="item.name" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
					<span class="text"><span class="icon" :class="classMap[item.type]" v-show="item.type > 0"></span>{{item.name}}</span>
				</li>
			</ul>
		</div>
		<div class="foods" ref="foodswrapper" :scrollbar="options.scrollbar" :startY="options.startY">
			<ul class="food_ul">
				<li class="food_li right-item-hook" v-for="(item,index) in goddsData" ref="foodList" :key="item.name" >
					<h1 class="text">{{item.name}}</h1>

					<ul class="foodText_ul">
						<li class="foodText_li" v-for="food in item.foods" :key="food.name" @click="openFood(food)">
							<div class="cicon">
								<img width="57" height="57" :src="food.image" alt="菜" />
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="des">{{food.description}}</p>
								<div class="extra">
									<span class="sellCount">月销量{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="icon iconfont  icon-rmb"></span><span class="price">{{food.price}}</span>
									<span class="oldPrice" v-if="food.oldPrice"><span class="oldPriceIcon iconfont  icon-rmb"></span>{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol">
									<!--购物车小球-->
									<v-cartcontrol  @cartAdd="cart_Add" :foods="food"></v-cartcontrol>
								</div>
							</div>
						</li>
					</ul>

				</li>
			</ul>
		</div>
		
		<v-food @cartAdd="cart_Add" ref="food" :food="selledfoods"></v-food>
		
		<v-shopcart ref="shopcart" :sellFoods="sellfoods"></v-shopcart>
		
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import axios from 'axios';
	import shopcart from '@/components/shopcart/shopcart';//底部-购物车组件
	import food from '@/components/food/food';//商品详情
	import cartcontrol from '@/components/cartcontrol/cartcontrol';//添加删除购物车的 + -组件

	export default {
		components:{
			'v-shopcart':shopcart,
			'v-cartcontrol':cartcontrol,
			'v-food':food
		},
		data() {
			return {
				selledfoods:{},
				goddsData: [],
				listHeight: [],
				options: {
					pullDownRefresh: {
						threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
						stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 0px 的位置
					},
					pullUpLoad: {
						threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
					},
					pullDownRefresh: false, //关闭下拉
					pullUpLoad: false, // 关闭上拉
					click: true,
					probeType: 3,
					startY: 0,
					scrollbar: false
				}
			}
		},
		computed: {
			//利用vue中的计算属性computed实时计算，对listHeight遍历，返回当前的左边mune-wrapper的li
			//对应的index，从而让其显示高亮的属性.current
			currentIndex() {
				
				for(let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];

					//当遍历到listHeight最后一个元素的时候，height2的值为undefined,如果是
					//最后一个元素的话!height2为真，后面就不需要判断了
					if(!height2 || (this.options.startY >= height1 && this.options.startY < height2)) {
						return i;
					}
				}
				//默认情况下是返回第一个元素
				return 0;
			},
			sellfoods() {//传值给shopcart组件 
				let food = [];
				
				this.goddsData.forEach((good)=>{
					good.foods.forEach((foods)=>{
						food.push(foods);
					})
				})
				
				return food;
			}
		},
//		watch: {
//	    	goddsData(val){
//	    		alert(111)
//	    	},
//	    	deep: true,
//  		immediate: false
//	  	},
		methods: {
			openFood(food) {//商品列表详情
				//页面刷新数据会缺失
//				this.$router.push({name:'food',params:{foods:JSON.stringify(food)}})
				//页面刷新数据不会缺失
//				this.$router.push({path:'/food?foods='+JSON.stringify(food)})
				
				this.selledfoods = food;
				this.$refs.food.foodsShow();
			},
			cart_Add(el_target){//接收cartcontrol$emit过来的add-dom
				//优化体验 ，异步执行动画
				this.$nextTick(()=>{
					this.$refs.shopcart.drop(el_target);
				})
			},
			requestData() {
				this.$nextTick(() => {
					axios.get("/api/goods").then((response) => {
						this.goddsData = response.data.data;
						
						this.foodswrapper.finishPullUp(); //上啦
						this.pullingDownUp() //重新计算元素高度
						
						this.$nextTick(() => {
							//计算右边.foodswrapper的每个li的累加的高度，存放在listHeight中
							this.calculateHeight();
						})

					}).catch((err) => {
						console.log(err)
					})
				})
			},
			selectMenu(index, event) {//左侧导航
				
				//浏览器的事件对象是没有_constructed属性，当是浏览器触发的时候就return
				//而用better-scroll自定义的事件触发的时候有这个属性，为true
				//用这个属性，就是避免在浏览器点击的时候，触发两次点击的效果
				if(!event._constructed) {
					return;
				}
				//点击左侧的菜单项的时候，右边跳到相应的内容区域
				let foodList = this.$refs.foodList; //获取到右边li对象
				
				let el = foodList[index]; //根据index，获取到右边具体滚动到的li
				this.foodswrapper.scrollToElement(el, 300); //要滑动到右边的对象，300完成动作的时间

			},
			calculateHeight() {
				let foodList = this.$refs.foodList; //获取到所有右侧的ref='foodList'的DOM元素
				let height = 0;
				this.listHeight = [];
				this.listHeight.push(height); //第一个元素的高度是0

				for(let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight; //通过原生DOM中的js获取到li的高度，并且累加
					this.listHeight.push(height);
				}
			},
			load() {
				//初始化需要滚动的对象,通过vm.$refs可以获取到在<template>中设置ref=menuWrapper属性的元素节点
				this.menuscroll = new BScroll(this.$refs.menuwrapper, this.options);

				// 上拉
				if(!this.foodswrapper) {
					this.foodswrapper = new BScroll(this.$refs.foodswrapper, this.options);
					this.foodswrapper.on('pullingUp', () => {
						this.requestData();
					});

					this.foodswrapper.on('scroll', (pos) => {
						//this.options.startY是自定义的变量，用于存储滚动的位置
						//Math.round(pos.y)是一个负数
						//Math.abs(pos.y)正数
//						console.log(Math.abs(Math.round(pos.y)))
						if(pos.y <= 0) {
							this.options.startY = Math.abs(Math.round(pos.y));
						}
					});

				} else {
					this.foodswrapper.refresh() //重新计算元素高度
				}
			},
			pullingDownUp() {
				this.foodswrapper.refresh() //重新计算元素高度
			}
		},
		mounted() {
			//图片显示class切换
			this.classMap = ['decrease_3', 'discount_3', 'special_3', 'invoice_3', 'guarantee_3'];
		},
		created() {
			 // 页面渲染完成后的回调
			this.$nextTick(() => {
				this.load();
				this.requestData();
			})
		}
	}
</script>

<style lang="scss" scoped="" type="text/css">
	@import "@/common/css/common.scss";
	
	#goods {
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 64px;
		width: 100%;
		overflow: hidden;
		.menu {
			flex: 0 0 80px;
			width: 80px;
			height: 100%;
			background: #f3f5f7;
			.menu_ul {
				.menu_li {
					display: table;
					height: 54px;
					width: 56px;
					line-height: 14px;
					padding: 0 12px;
					.text {
						display: table-cell;
						width: 56px;
						font-size: 12px;
						vertical-align: middle;
						@include border-bottom_1px(rgba(7, 17, 27, 0.1));
					}
					&.current {
						/*当计算出来的索引等于当前索引，就给相应的menu-item加上.current*/
						position: relative;
						margin-top: -1px;
						z-index: 10;
						background: #fff;
						font-weight: 700;
						.text {
							@include border-bottom_none();
						}
					}
					.icon {
						display: inline-block;
						width: 12px;
						height: 12px;
						margin-right: 2px;
					}
					.decrease_3 {
						@include bg-Img('../../assets/goods/decrease_3@2x.png');
					}
					.discount_3 {
						@include bg-Img('../../assets/goods/discount_3@2x.png');
					}
					.guarantee_3 {
						@include bg-Img('../../assets/goods/guarantee_3@2x.png');
					}
					.invoice_3 {
						@include bg-Img('../../assets/goods/invoice_3@2x.png');
					}
					.special_3 {
						@include bg-Img('../../assets/goods/special_3@2x.png');
					}
				}
			}
		}
		.foods {
			flex: 1;
			background: #fff;
			overflow: hidden;

			.food_ul {
				.food_li {
					.text {
						padding-left: 14px;
						font-size: 12px;
						line-height: 26px;
						color: rgb(147, 153, 159);
						background: #f3f5f7;
						border-left: 2px solid #d9dee1;
					}
					.foodText_ul {
						padding: 0px 18px;
						.foodText_li {
							display: flex;
							padding: 18px 0;
							@include border-bottom_1px(rgba(7, 17, 27, 0.1));
							&:last-child {
								@include border-bottom_none();
							}
							.cicon {
								flex: 0 0 57px;
								margin-right: 10px;
							}
							.content {
								flex: 1;
								position: relative;
								    
								.name {
									margin: 2px 0 8px 0;
									font-size: 14px;
									color: rgb(7, 17, 27);
									font-weight: 600;
									line-height: 14px;
								}
								.des {
									font-size: 10px;
									line-height: 13px;
									margin-bottom: 8px;
									color: rgb(147, 153, 159);
								}
								.extra {
									font-size: 10px;
									line-height: 13px;
									margin-bottom: 8px;
									color: rgb(147, 153, 159);
									.sellCount {
										margin-right: 12px;
									}
								}
								.price {
									.icon {
										font-size: 10px;
										color: red;
										font-weight: 700;
									}
									.price {
										font-size: 16px;
										color: red;
										padding: 0 8px 0 0;
										font-weight: 700;
										line-height: 24px;
									}
									.oldPrice {
										font-size: 14px;
										color: rgb(147, 153, 159);
										font-weight: 700;
										line-height: 24px;
										text-decoration: line-through;
									}
									.oldPriceIcon {
										color: rgb(147, 153, 159);
										font-size: 10px;
										font-weight: 700;
									}
								}
								.cartcontrol{
									position: absolute;
								    right: 0px;
								    bottom: 0px;
								    font-size: 0;
								}
							}
						}
					}
				}
			}
		}
	}
</style>