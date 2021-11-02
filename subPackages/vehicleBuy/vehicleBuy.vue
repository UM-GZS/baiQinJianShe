<template>
	<view class="info_wrap">
		<!-- 切换按钮 -->
		<view class="swiper_tab">
			<view class="tab_item" @click="changeTab(item.id,index)" v-for="(item,index) in tabList" :key="index">
				<image style="width: 40rpx;height: 40rpx;" :src="current === index ? item.activeImg : item.img"></image>
				<text style="margin-left: 10rpx;"
					:style="current === index ? 'color:black':'color:$gray_color'">{{ item.title }}</text>
			</view>
		</view>
		<!-- 内容区域 -->
		<swiper @change="change" :current="current" class="swiper_content" enable-flex :style="current === 1 ? 'padding-bottom:130rpx':'0'">
			<swiper-item v-for="(swiperItem,swiperIndex) in tabList" :key="swiperIndex" class="swiper_wrap">
				<!-- 二手交易 -->
				<scroll-view @scrolltolower="lower" scroll-y v-if="swiperIndex==1"
					enable-flex  style="width: 100%;height: 100%;padding-bottom:10rpx;">
					<view v-if="secondHandList.length>0">
						<view class="info_item secondHand" v-for="(item,index) in secondHandList" :key="index" @click.stop="goDetail(item.id)">
							<!-- 图片以及文字内容 -->
							<view class="info_content">
								<view class="left_pic">
									<image style="width: 100%;height: 100%;" :src="baseUrl+item.small_img_urls">
									</image>
								</view>
								<view class="right_msg">
									<view class="desc">
										{{item.name}}
									</view>
									<!-- 用户信息 -->
									<view class="user_info">
										<view class="base_info">
											{{item.info}}
										</view>
									</view>
									<!-- 收藏以及分享 -->
									<view class="edit">
										<view class="collect common userBg" >
											<text style="padding-bottom:5rpx">{{item.person_type_name}}</text>
										</view>
									</view>
									<view class="edit">
										<view class="share common">
											<text style="color:#000;">￥{{item.price}}</text>
										</view>
									</view>


								</view>
							</view>
						</view>
					</view>
					<nonedata v-else :text="`列表为空`"></nonedata>
				</scroll-view>

				<!-- 新机置换 -->
				<scroll-view @scrolltolower="lower" scroll-y  v-if="swiperIndex==0"
					enable-flex    style="width: 100%;height: 100%;padding-bottom:10rpx;">

					<view v-if="machinesList.length>0">
						<view class="info_item" v-for="(item,index) in machinesList" :key="index" @click.stop="goMachinesList(item.id)">
							<!-- 图片以及文字内容 -->
							<view class="info_content">
								<view class="left_pic">
									<image style="width: 100%;height: 100%;" :src="baseUrl+item.small_img_urls">
									</image>
								</view>
								<view class="right_msg">
									<view class="desc">
										{{item.name}}
									</view>
									<!-- 出厂 -->
									<view class="user_info">
										<view class="base_info">
											出厂:{{item.create_time | filterDate3}}
										</view>
									</view>
									<!-- 车辆 -->
									<view class="user_info">
										<view class="base_info">
											车辆:{{item.vehicle}}
										</view>
									</view>
									<!-- 类型 -->
									<view class="user_info">
										<view class="base_info">
											类型:{{item.types}}
										</view>
									</view>
									<!-- 品牌 -->
									<view class="user_info">
										<view class="base_info">
											品牌:{{item.brand}}
										</view>
									</view>

									<!-- 最底下的时间 -->
									<view class="user_info date">
										<view class="base_info">
											{{item.create_time | filterDate2}}
										</view>
									</view>

								</view>
							</view>
						</view>
					</view>
					<nonedata v-else :text="`列表为空`"></nonedata>

				</scroll-view>


				<!-- 车辆租赁 -->
				<scroll-view @scrolltolower="lower" scroll-y v-if="swiperIndex==2"
					enable-flex  style="width: 100%;height: 100%;padding-bottom:10rpx;">

					<view v-if="vehicelList.length>0">
						<view class="info_item" v-for="(item,index) in vehicelList" :key="index">
							<!-- 图片以及文字内容 -->
							<view class="info_content">
								<view class="left_pic">
									<image style="width: 100%;height: 100%;" src="../../static/index/sw1.jpg">
									</image>
								</view>
								<view class="right_msg">
									<view class="vehicel_title">
										{{ item.title }}
									</view>
									<view class="vehicel_desc">
										{{ item.desc }}
									</view>
									<view class="vehicel_server">
										<view class="item">
											直营车辆
										</view>
									</view>
									<view class="vehicel_price">
										<text>￥{{ item.price }}/天</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<nonedata v-else :text="`列表为空`"></nonedata>

				</scroll-view>
				
			</swiper-item>

		</swiper>

		<!-- <view class="send_secondHand" v-if="current==1 || current==0" @click="goSecondHand">
			<view class="text">
				发布交易信息
			</view>
		</view> -->
		<view class="send_secondHand" v-if="current==1" @click="goSecondHand">
			<view class="text">
				发布交易信息
			</view>
		</view>
		<!-- <view class="confirm_order" v-if="current==0" @click="confirmOrder">
			<view class="text">
				确认订单
			</view>
		</view> -->

	</view>
</template>

<script>
	import vehicleApi from "../../network/vehicleBuy/vehicleApi"
	import secondHandApi from "../../network/secondHand/secondHand"
	import nonedata from "../../components/none-data/none-data"
	export default {
		components: {
			nonedata
		},
		data() {
			return {
				//! 数据切换标题数据
				tabList: [{
						id: 1,
						title: '新机置换',
						img: '../../static/vehicle/xinji.png',
						activeImg: '../../static/vehicle/xinji2.png'
					},
					{
						id: 2,
						title: '二手交易',
						img: '../../static/vehicle/ershou.png',
						activeImg: '../../static/vehicle/ershou2.png'
					},
					{
						id: 3,
						title: '车辆租赁',
						img: '../../static/vehicle/chuzu.png',
						activeImg: '../../static/vehicle/chuzu2.png'
					}
				],
				current: 0, //! 默认选中的swiper下标
				secondHandList: [],// 二手列表
				baseUrl: "",
				// 二手交易请求参数
				secondHandInfo: {
					page_num:1,
					page_size:10,
					sort:'id desc'
				},
				machinesList:[],// 新机列表
				vehicelList:[
					{
						id:1,
						title:'旋挖机租赁质量保证行业的领先者',
						desc:'二手旋挖机质量优选',
						price:200
					},
					{
						id:2,
						title:'旋挖机租赁质量保证行业的领先者2',
						desc:'二手旋挖机质量优选',
						price:220
					},
					{
						id:3,
						title:'旋挖机租赁质量保证行业的领先者3',
						desc:'二手旋挖机质量优选',
						price:230
					}
				],//车辆租赁列表
				page:1,
				machinesHasMore:true,// 新机page
				// 是否还有二手交易
				secondHandHasMore:true
			}
		},
		onLoad() {
			this.init();
			this.baseUrl = getApp().globalData.requesturl
		},
		onShow(){
			console.log(getCurrentPages())
			//!判断当前的current是否为1  重新获取数据
			if(this.current === 1) {
				this.clearData()
				this.init()
			}
		},
		// destroyed(){
		// 	this.$store.state.vehicleType = 0
		// },
		filters: {
			filterDate2: function(value) {
				return getApp().globalData.formatDate2(value);
			},
			filterDate3: function(value) {
				return getApp().globalData.formatDate3(value);
			},
		},
		methods: {
			init(){
				// let type = this.$store.state.vehicleType
				
				if(this.current == 2){
					// 车辆租赁
					// this.current=2
					this.getVehicelList()
				}else if(this.current  === 1){
					// 二手交易
					// this.current=1
					this.getSecondHandList()
				}else{
					// 新机置换
					// this.current=0
					this.getMachinesList()
				}
			},
			// 获取新机列表
			getMachinesList() {
				let query = {
					page_num: this.page,
					page_size: 15,
				}
				vehicleApi.geiNewMachinesList(query).then(res => {
					if(res.data.list.length<15){
						this.machinesHasMore = false
					}
					let data = this.machinesList.concat(res.data.list)
					this.machinesList = data
				})
			},
			// 获取二手交易列表
			getSecondHandList() {
				secondHandApi.getList(this.secondHandInfo).then(res => {
					if(res.data.list.length < 10) {
						this.secondHandHasMore = false;
					}
					let data = this.secondHandList.concat(res.data.list);
					this.secondHandList = data;
				})
			},
			// 获取车辆租赁列表
			getVehicelList(){
				this.vehicelList = []
			},
			//! 按钮点击的切换
			changeTab(id, index) {
				this.current = index;
			},
			//! 滑动页面的切换
			change(e) {
				this.current = e.target.current;
				if(this.current==0){
				}else if(this.current==1){
					this.clearData()
					this.getSecondHandList()
				}else{
					// this.vehicelList = []
					// this.getVehicelList()
				}
			},
			//! 数据滚动到底部的监听
			lower() {
				if(this.current === 0 && this.machinesHasMore){
					this.page++
					this.init()
				}else if(this.current === 1 && this.secondHandHasMore) {
					this.secondHandInfo.page_num ++; //添加页数
					this.getSecondHandList();
				}

			},
			goSecondHand() {
				//! 判断用户是否已经完成登录
				if (!getApp().globalData.wxuser) {
					getApp().globalData.global_Toast(true, "请先完成登录", function(res) {});
					setTimeout(() => {
						uni.navigateBack({
							delta:1
						})
					},2500)
					return;
				} else {
					uni.navigateTo({
						url: "../vehicleBuy/secondHand"
					})
				}

			},
			// 二手交易里de跳转详情
			goDetail(id) {
				this.$store.state.vehicleType = 1
				uni.navigateTo({
					url: "./secondHandDetail?id=" + id
				})
			},
			// 新机置换de跳转详情
			goMachinesList(id){
				/**
				 * 跳转传递order_types来判断是从哪个界面进入
				 * 0表示新机置换 1表示租赁订单 2商品分类订单
				 */ 
				// this.$store.state.vehicleType = 0
				uni.navigateTo({
					url: `../category/category_detail?order_types=0&id=${id}`
				})
			},
			//!清除默认数据
			clearData() {
				this.secondHandInfo = {
					page_num:1,
					page_size:10,
					sort:'id desc'
				}
				this.secondHandList = [];
				this.secondHandHasMore = true;
			}
		},

	}
</script>

<style lang="scss">
	.info_wrap {
		width: 100%;
		height: 100%;
		padding-bottom: 100rpx;
		overflow-y: hidden;

		.swiper_tab {
			margin-top: 10rpx;
			width: 100%;
			height: 90rpx;
			background-color: #ffffff;
			display: flex;

			.tab_item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: 600;
				font-size: 30rpx;
				color: $gray_color;
			}
		}

		//! 内容区域
		.swiper_content {
			width: 100%;
			margin-top: 30rpx;
			height: 100%;
			overflow-y: scroll;
			// padding: 0 20rpx 0 20rpx;
			box-sizing: border-box;
			
			.swiper_wrap {
				width: 100%;
				box-sizing: border-box;
				padding: 0 20rpx;
			}
			
			.info_item {
				width: 100%;
				display: flex;
				flex-direction: column;
				background-color: #ffffff;
				border-radius: 15rpx;
				padding: 0 30rpx;
				margin-bottom: 10rpx;
				

				//! 图片以及文字内容
				.info_content {
					width: 100%;
					margin: 20rpx 0;
					display: flex;
					align-items: center;
					height: 280rpx;
					.left_pic {
						width: 240rpx;
						height: 250rpx;
						border: 1rpx solid #bbbbbb;
						@include flex-center;
					}

					.right_msg {
						flex: 1;
						margin-left: 10rpx;
						display: flex;
						height: 100%;
						flex-direction: column;
						display: flex;
						justify-content: center;
						
						.desc {
							width: 100%;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							font-size: 30rpx;
							font-weight: 600;
							overflow: hidden;
						}

						.share {
							margin: 0;
							padding: 0;
							background: transparent;
							// font-size: 25rpx;
							color: $gray_color;

							&::after {
								border: none;
							}
						}

						//! 公共样式
						.common {
							display: flex;
							font-size: 28rpx;
							align-items: center;
						}

						.user_info {
							margin: 3rpx 0;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: $gray_color;
						}
						.user_info.date{
							margin: 4rpx 0;
							display: flex;
							justify-content: flex-end;
							align-items: center;
							color: $gray_color;
						}

						//! 操作
						.edit {
							width: 100%;
							display: flex;
							color: $gray_color;
							flex-direction: column;
							align-items: flex-start;

							.userBg {
								background-color: #ffa02e;
								color: #ffffff;
								min-width: 80rpx;
								padding-right: 10rpx;
								@include flex-center;
							}
						}
						//! 车辆租赁样式
						.vehicel_title {
							width: 100%;
							font-size: 30rpx;
							font-weight: 580;
							@include clamp2;
						}
						.vehicel_desc {
							font-size: 26rpx;
							color: $gray_color;
							margin-top: 20rpx;
							@include clamp2;
						}
						.vehicel_server {
							display: flex;
							width: 100%;
							flex-wrap: wrap;
							.item {
								font-size: 22rpx;
								margin-top: 15rpx;
								padding: 10rpx 20rpx;
								color: #ffffff;
								background-color: #ffa02e;
								border-radius: 10rpx;
							}
						}
						.vehicel_price {
							font-size: 32rpx;
							font-weight: 700;
							margin-top: 20rpx;
						}
					}

				}

			}
			.info_item:nth-last-child(1){
				margin-bottom: 40rpx;
			}
			// .info_item:nth-last-child(1){
			// 	margin-bottom: 130rpx;
			// }

			// 二手交易的样式
			.info_item.secondHand {
				width: 100%;
				display: flex;
				flex-direction: column;
				background-color: #ffffff;
				border-radius: 15rpx;
				padding: 0 30rpx;
				margin-bottom: 10rpx;

				//! 图片以及文字内容
				.info_content {
					width: 100%;
					display: flex;
					align-items: center;

					.left_pic {
						width: 240rpx;
						height: 250rpx;
						border: 1rpx solid #bbbbbb;
						@include flex-center;
					}

					.right_msg {
						flex: 1;
						margin-left: 10rpx;
						display: flex;
						height: 90%;
						flex-direction: column;
						justify-content: space-between;


						.desc {
							width: 100%;
							min-height: 50rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							font-size: 30rpx;
							font-weight: 600;
							// overflow: hidden;
						}

						.share {
							margin: 0;
							padding: 0;
							background: transparent;
							color: $gray_color;

							&::after {
								border: none;
							}
						}

						//! 公共样式
						.common {
							display: flex;
							font-size: 28rpx;
							align-items: center;
						}

						.user_info {
							margin: 5rpx 0;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: $gray_color;

						}
						.user_info.date{
							margin: 4rpx 0;
							display: flex;
							justify-content: flex-end;
							align-items: center;
							color: $gray_color;
						}

						//! 操作
						.edit {
							width: 100%;
							display: flex;
							color: $gray_color;
							flex-direction: column;
							align-items: flex-start;

							.userBg {
								background-color: #ffa02e;
								color: #ffffff;
								min-width: 80rpx;
								padding-right: 10rpx;
								@include flex-center;
							}
						}

					}

				}

			}
			._item.secondHand:nth-last-child(1){
				margin-bottom: 20rpx;
			}
			// .info_item.secondHand:nth-last-child(1){
			// 	margin-bottom: 130rpx;
			// }
			
		}
		

		// 发布二手信息
		.send_secondHand {
			position: fixed;
			bottom: 0;
			left: 0;
			height: 110rpx;
			width: 100%;
			@include flex-center;
			background-color: #fff;

			.text {
				width: 80%;
				background-color: $page_color;
				@include flex-center;
				height: 70%;
				font-size: 34rpx;
				font-weight: 600;
				color: #38393B;
				border-radius: 50rpx;
			}
		}
		// 确认订单
		.confirm_order {
			position: fixed;
			bottom: 0;
			left: 0;
			height: 110rpx;
			width: 100%;
			@include flex-center;
			background-color: #fff;

			.text {
				width: 80%;
				background-color: $page_color;
				@include flex-center;
				height: 70%;
				font-size: 38rpx;
				color: #38393B;
				border-radius: 20rpx;
			}
		}

	}
</style>
