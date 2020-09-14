<template>
	<div id="header">
		<!---->
		<div class="content-wrapper">
			<div class="avatarLogo">
				<img width="100%" :src="headerData.avatar"/>
			</div>
			<!---->
			<div class="content">
				<!---->
				<div class="title">
					<span class="brandImg"></span>
					<span class="name">{{headerData.name}}</span>
				</div>
				<!---->
				<div class="description">
					{{headerData.description}} / {{headerData.deliveryTime+'分钟送达'}}
				</div>
				<!---->
				<div v-if="headerData.supports" class="supports">
					<span class="decreaseImg" :class="classMap[headerData.supports[0].type]"></span><span class="text">{{headerData.supports[0].description}}</span>
				</div>
				<div v-if="headerData.supports" class="supports-count" @click="showDetails">
					<span class="text">{{headerData.supports.length+'个'}}</span>
					<span class="icon iconfont icon-arrow-right"></span>
				</div>
				<!---->
			</div>
		</div>
		<!---->
		<div class="bulletin-wrapper" @click="showDetails">
			<span class="bulletinImg"></span><span class="bulletin-text">{{headerData.bulletin}}</span>
			<span class="icon iconfont icon-arrow-right"></span>
		</div>
		
		<div class="backgroundImg">
			<img width="100%" :src="headerData.avatar"/>
		</div>
		
		<div class="details" v-show="detailsShow">
			<div class="details-wrapper clearfix">
				<div class="details-main">
					<h1 class="name">{{headerData.name}}</h1>
					<v-star :score="headerData.score" :size="size"></v-star>
					<v-linktitle :title="'优惠信息'" class="linkTile"></v-linktitle>
					
					<ul v-if="headerData.supports" class="supports_ul">
						<li class="supports-item"  v-for="(item,index) in headerData.supports" :key="index">
							<span class="icon" :class="classMap[headerData.supports[index].type]"></span>
							<span class="text">{{headerData.supports[index].description}}</span>
						</li>
					</ul>
					
					<v-linktitle :title="'商家公告'" class="linkTile"></v-linktitle>
					
					<div class="merchant-wrapper">
						<p>{{headerData.bulletin}}</p>
					</div>
				</div>
			</div>
			<div class="details-close" @click="hideDetails">
				<span class="icon iconfont icon-close"></span>
			</div>
		</div>
		
	</div>
</template>

<script>
	import axios from 'axios';
	import store from '@/vuex/store';
	import star from '@/components/star/star';
	import linkTitle from '@/components/header/linkTitle';
//	import Bus from '@/common/js/bus.js'//公共传值js
	
export default {
	store,
	components:{
		'v-star':star,
		'v-linktitle':linkTitle,
	},
 	data(){
	 	return{
	 		headerData:[],
	 		detailsShow:false,
	 		size:48
	 	}
 	},
 	methods:{
 		showDetails(){
 			this.detailsShow = true;
 		},
 		hideDetails(){
 			this.detailsShow = false;
 		},
 		requestData(){
			var that = this;
			axios.get("/api/seller").then((response)=>{
				that.headerData = response.data.data;
				
				this.$store.commit('setHeaderData',JSON.stringify(response.data.data));
//				Bus.$emit('headerData', response.data.data);
				
			}).catch((err)=>{
				console.log(err)
			})
			
		}
 	},
 	mounted(){
	  	this.requestData();
	  	this.classMap = ['decrease_1','discount_1','special_1','invoice_1','guarantee_1'];
	}
}
</script>

 <style lang="scss" scoped="" type="text/css"> 
 	@import "@/common/css/common.scss"; 
 
	#header{
		position: relative;
		color: #fff;
		background: rgba(7,17,27,0.5);
		font-weight: 200;
		overflow: hidden;
		
		.content-wrapper{
			position: relative;
			padding: 24px 12px 18px 24px;
			font-size: 0;
			display: flex;
			
			.avatarLogo{
				width: 64px;
				height: 64px;
				min-height: 64px;
				min-width: 64px;
				overflow: hidden;
				display: inline-block;
				border-radius: 3px;
			}
			
			.content{
				display: inline-block;
				font-size:14px;
				margin-left: 16px;
				vertical-align: top;
	    		overflow: hidden;
	    		
	    		div{
	    			@include font-text-overflow();
	    		}
				.title{
					margin:2px 0 6px 0;
				    
					.brandImg{
						display: inline-block;
						width: 30px;
						height: 18px;
						@include bg-Img('../../assets/header/brand@2x.png');
						vertical-align: top;
					}
					.name{
						font-size:16px;
						font-weight: 600;
						margin-left: 6px;
						line-height: 18px;
					}
				}
				.description{
					margin-bottom: 10px;
					font-size: 12px;
					line-height: 12px;
				}
				.supports{
					padding-right: 10px;
					
					.decreaseImg{
						display: inline-block;
						width: 12px;
						height: 12px;
						margin-right: 4px;
					}
					.decrease_1{
						@include bg-Img('../../assets/header/decrease_1@2x.png');
					}
					
					.discount_1{
						@include bg-Img('../../assets/header/discount_1@2x.png');
					}
					
					.guarantee_1{
						@include bg-Img('../../assets/header/guarantee_1@2x.png');
					}
					
					.invoice_1{
						@include bg-Img('../../assets/header/invoice_1@2x.png');
					}
					
					.special_1{
						@include bg-Img('../../assets/header/special_1@2x.png');
					}
					
					.text{
						font-size: 10px;
						vertical-align: top;
						line-height: 12px;
					}
				}
				.supports-count{
					position: absolute;
					right: 12px;
					bottom: 18px;
					height: 24px;
					line-height: 24px;
					padding: 0px 8px;
					border-radius: 14px;
					background: rgba(0,0,0,0.2);
					text-align: center;
					
					.text{
						font-size: 10px;
					}
					.icon{
						font-size: 10px;
					}
				}
			/*content*/
			}
		/*content-wrapper*/
		}
		.bulletin-wrapper{
			position: relative;
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			background: rgba(7,17,27,0.2);
			overflow: hidden;
			white-space: nowrap;
		    text-overflow: ellipsis;
			
			.bulletin-text{
				font-size: 10px;
				vertical-align: top;
			}
			.bulletinImg{
				display: inline-block;
				width: 22px;
				height: 12px;
				@include bg-Img('../../assets/header/bulletin@2x.png');
				background-size: 100%;
				margin-right: 4px;
				margin-top: 8px;
				vertical-align: top;
			}
			.icon{
				position: absolute;
				right: 12px;
				bottom: 0px;
				font-size: 10px;
			}
		}/*bulletin-wrapper*/
		
		.backgroundImg{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(10px);
		}
		
		.details{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:rgba(7,16,27,0.8);
			text-align: center;
			z-index: 100;
			overflow: auto;
			 /*filter: blur(10px);*/
			 
			.details-wrapper{
				min-height: 100%;
				width: 100%;
				   
				.details-main{
					margin-top: 64px;
					padding-bottom: 64px;
					
					.name{
						font-size: 16px;
						font-weight: 700;
						line-height: 16px;
						margin-bottom: 16px;
					}
					.linkTile{
						margin:28px auto 24px auto;
						text-align: center;
						font-size: 14px;
					}
					.supports_ul{
						width: 80%;
						margin: 0 auto;
    					text-align: left;
    					@include font-text-overflow();
    					
						.supports-item{
							padding: 0 12px;
							font-size:12px;
							margin-bottom: 12px;
							font-size: 0;
							overflow: hidden;
							
							&:last-child{
								margin-bottom: 0;
							}
							.text{
								display: inline-block;
								width: 90%;
							    font-size: 12px;
							    line-height: 16px;
							    overflow: hidden;
							    white-space: nowrap;
							    text-overflow: ellipsis;
							}
							.icon{
								display: inline-block;
								width: 16px;
								height: 16px;
								vertical-align: top;
								margin-right: 6px;
							}
							.decrease_1{
								@include bg-Img('../../assets/headerDetails/decrease_2@2x.png');
							}
							
							.discount_1{
								@include bg-Img('../../assets/headerDetails/discount_2@2x.png');
							}
							
							.guarantee_1{
								@include bg-Img('../../assets/headerDetails/guarantee_2@2x.png');
							}
							
							.invoice_1{
								@include bg-Img('../../assets/headerDetails/invoice_2@2x.png');
							}
							
							.special_1{
								@include bg-Img('../../assets/headerDetails/special_2@2x.png');
							}
						}
						
					}
					.merchant-wrapper{
						width: 80%;
						margin: 0 auto;
						font-size: 12px;
						line-height: 24px;
						
						&>p{
							text-align: left;
							padding:  0 12px;
						}
					}
				}
			}
			.details-close{
				position: relative;
				width: 32px;
				height: 32px;
				margin: -64px auto 0 auto;
				clear: both;
				
				.icon{
					color: #fff;
					font-size: 32px;
					font-weight: 200;
				}
			}
			
		}
	}/**/
</style>