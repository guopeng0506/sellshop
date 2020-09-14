<template>
	<div class="seller" ref="seller">
		<div class="seller_content">
			<div class="merchant_title">
				<div class="merchantHeder">
					<h1 class="name">{{headerData.name}}</h1>
					<div class="star_content">
						<div class="star">
							<v-star :score="headerData.score" :size="36"></v-star>
						</div>
						<span class="ratingCount">({{headerData.ratingCount}})</span>
						<span class="sellCount">月售{{headerData.sellCount}}单</span>
					</div>
					
					<div class="collect" @click="collect">
						<span class="iconfont" :class="collectClass"></span>
						<!--<span class="iconfont "></span>-->
						<div class="text">{{collectText}}</div>
						<!--<div class="text">未收藏</div>-->
					</div>
				</div>
				<div class="merchant">
					<div class="minimum">
						<p class="text">起送价</p>
						<p class="money">{{headerData.minPrice}}<span class="my">元</span></p>
					</div>
					<div class="distribution">
						<p class="text">商家配送</p>
						<p class="money">{{headerData.deliveryPrice}}<span class="my">元</span></p>
					</div>
					<div class="distributionTime">
						<p class="text">平均配送时间</p>
						<p class="money">{{headerData.deliveryTime}}<span class="my">分钟</span></p>
					</div>
				</div>
			</div>
			<div class="merchant_activity">
				<div class="activity_content">
					<h1 class="title">公告与活动</h1>
					<p class="text_p">{{headerData.bulletin}}</p>

					<ul v-if="headerData.supports" class="activity_ul">
						<li class="activity_li"  v-for="(item,index) in headerData.supports" :key="index">
							<span class="icon" :class="classMap[headerData.supports[index].type]"></span>
							<span class="text">{{headerData.supports[index].description}}</span>
						</li>
					</ul>
					
				</div>
			</div>
			<div class="merchant_img">
				<h1 class="title">商家实景</h1>
				<div class="pic_war" ref="picWarpper">
					<ul class="pic_ul" ref="picUl">
						<li class="pic_item" v-for="pics in headerData.pics">
							<img width="120" height="90" :src="pics" alt="" />
						</li>
					</ul>
				</div>
			</div>
			<div class="merchant_mes">
				<h1 class="title">商家信息</h1>
				<ul>
					<li class="list" v-for="item in headerData.infos">
						{{item}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import BScroll from 'better-scroll';
	import star from '@/components/star/star';
	
	
	export default {
		components:{
			'v-star':star
		},
		data() {
			return{
				classMap:[],
				collectType:false,
				options: {
					startX: 0,
		            click: true,
		            scrollX: true,
		            scrollY: false,
		            eventPassthrough: "vertical",
		            bounce: false
				}
			}
		},
		computed:{
	 		headerData() {
				//获取header组件通过vuex存储的数据
				return this.$store.state.headerData != null?JSON.parse(this.$store.state.headerData):'';
			},
			collectText() {
				let c = '';
				this.$store.state.collectType? c='已收藏' : c='未收藏';
				
				return c;
			},
			collectClass() {
				let c = '';
				this.$store.state.collectType? c='icon-favorites-fill' : c='icon-favorites';
				return c;
			}
	 	},
		methods:{
			collect(){
				this.collectType = !this.collectType;
				
				this.$store.commit('setCollect',this.collectType);
			},
			ready() {//商家实景左右滑动
				//如果有图片
				if(this.headerData.pics){
					let marginRight = 6;//图片缝隙6px
					let imgWigth = 120;//图片宽度
					let picWidth = (imgWigth + marginRight) * this.headerData.pics.length - marginRight;//最后一个图片没有margin
					this.$refs.picUl.style.width = picWidth + 'px';
					
					this.$nextTick(()=>{
						//初始化需要滚动的对象,
						if(!this.scrollY){

							this.scrollY = new BScroll(this.$refs.picWarpper, this.options)
						}else{
							this.scrollY.refresh();
						}
					})
				}
			}
		},
		mounted() {
			
			this.classMap = ['decrease_1','discount_1','special_1','invoice_1','guarantee_1'];
			this.ready();
			
			this.$nextTick(()=>{
				//初始化需要滚动的对象,
				if(!this.scroll){
					this.scroll = new BScroll(this.$refs.seller, {click:true});
				}else{
					this.scroll.refresh();
				}
			})
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "@/common/css/common.scss";
	
	.seller{
		position:absolute;
		left: 0;
		top: 174px;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		
		.seller_content{
			background:#f3f5f7;
			
			.merchant_title{
				background: #fff;
				padding:18px;
				@include border-bottom_1px(rgba(7,17,27,.1));
				margin-bottom:18px;
				
				.merchantHeder{
					padding-bottom: 18px;
					@include border-bottom_1px(rgba(7,17,27,.1));
					    
					.name{
						font-size: 14px;
						color: rgb(7,17,27);
						line-height: 14px;
						font-weight: 700;
					}
					.star_content{
						
						.star{
							display: inline-block;
							margin: 8px 8px 0 0;
						}
						.ratingCount,.sellCount{
							font-size:10px;
							color: rgb(77,85,93);
							line-height: 18px;
							vertical-align: text-bottom;
						}
						.sellCount{
							padding-right: 12px;
							padding-left: 10px;
						}
					}
					
					.collect{
						position: absolute;
						right: 0;
						top: 0;
						    text-align: center;
						    
						.text{
							font-size: 10px;
							color: rgb(77,85,93);
							line-height: 10px;
							padding-top: 2px;
							font-weight: 200;
						}
						.icon-favorites-fill,.icon-favorites{
							font-size: 24px;
							color: rgb(240,20,20);
							line-height: 24px;
						}
						.icon-favorites{
							color: rgb(77,85,93);
						}
					}
				}
				.merchant{
					display: flex;
					padding-top: 18px;
					
					.minimum,.distribution,.distributionTime{
						flex: 3;
						text-align: center;
						
						.text{
							font-size: 10px;
							color: rgb(147,153,159);
							line-height: 10px;
							padding-bottom: 4px;
						}
						.money{
							font-size: 24px;
							font-weight: 200;
							color: rgb(7,17,27);
							line-height: 24px;
							
							.my{
								font-size: 10px;
								font-weight: 200;
								color: rgb(7,17,27);
								line-height: 10px;
							}
						}
					}
					.distribution{
						border-right: 1px solid rgba(7,17,27,.1);
						border-left: 1px solid rgba(7,17,27,.1);
					}
					.distributionTime{
						
					}
				}
			}
			.merchant_activity{
				background: #fff;
				padding: 18px 18px 0px 18px;
				margin-bottom: 18px;
				@include border-bottom_1px(rgba(7,17,27,.1));
				@include border-top_1px(rgba(7,17,27,.1));
				
				.title{
					font-size: 14px;
				    color: #07111b;
				    line-height: 14px;
				    font-weight: 700;
				}
				.text_p{
					padding: 8px 12px 16px 12px;
					font-size: 12px;
					font-weight: 200;
					line-height: 24px;
					color: rgb(240,20,20);
					@include border-bottom_1px(rgba(7,17,27,.1));
				}
				
				.activity_ul{
					font-size: 0;
					
					.activity_li{
						padding: 16px 12px;
						@include border-bottom_1px(rgba(7,17,27,.1));
						
						&:last-child {
							@include border-bottom_none();
						}
						
						.icon{
							display: inline-block;
							width: 16px;
							height: 16px;
							vertical-align: top;
						}
						.text{
							font-size: 12px;
							font-weight: 200;
							color: rgb(7,17,27);
							line-height: 16px;
							padding-left: 6px;
							vertical-align: top;
						}
						.decrease_1{
							@include bg-Img('../../assets/seller/decrease_4@2x.png');
						}
						
						.discount_1{
							@include bg-Img('../../assets/seller/discount_4@2x.png');
						}
						
						.guarantee_1{
							@include bg-Img('../../assets/seller/guarantee_4@2x.png');
						}
						
						.invoice_1{
							@include bg-Img('../../assets/seller/invoice_4@2x.png');
						}
						
						.special_1{
							@include bg-Img('../../assets/seller/special_4@2x.png');
						}
					}
				}
				
			}
			
			.merchant_img{
				padding: 18px;
				margin-bottom: 18px;
				background: #fff;
				@include border-bottom_1px(rgba(7,17,27,.1));
				@include border-top_1px(rgba(7,17,27,.1));
				
				.title{
					font-size: 14px;
				    color: #07111b;
				    line-height: 14px;
				    font-weight: 700;
				    margin-bottom: 12px;
				}
				
				.pic_war{
					width: 100%;
					/*overflow: hidden;*/
					white-space: nowrap; /**规定段落中的文本不进行换行 */
					
					.pic_ul{
						
						.pic_item{
							display: inline-block;/**给li设置块级元素并在同一行 */
							margin-right: 6px;
							
							&:last-child {
								margin-right: 0;
							}
						}
					}
				}
				
			}
			
			.merchant_mes{
				padding: 18px;
				background: #fff;
				@include border-top_1px(rgba(7,17,27,.1));
				
				.title{
					font-size: 14px;
				    color: #07111b;
				    line-height: 14px;
				    font-weight: 700;
				    margin-bottom: 12px;
				}
				
				.list{
					padding: 16px 12px;
					font-size: 12px;
					font-weight: 200;
					color: rgb(7,17,27);
					line-height: 16px;
					@include border-top_1px(rgba(7,17,27,.1));
				}
			}
			
		}
	}
</style>