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
		<swiper @change="change" :current="current" class="swiper_content" enable-flex>
			<swiper-item v-for="(swiperItem,swiperIndex) in tabList" :key="swiperIndex" class="swiper_wrap">
				<!-- 求职招聘 -->
				<scroll-view @scrolltolower="lower" scroll-y v-if="swiperIndex==0" enable-flex
					style="width: 100%;height: 100%;padding-bottom:10rpx;">
					<view class="list" v-if="sendList.length > 0">
						<view class="item" v-for="item in sendList" :key="item.id">
							<view class="left_cover">
								<image :src="baseUrl + JSON.parse(item.urls)[0].img"></image>
							</view>
							<view class="right_info">
								<view class="name">{{item.post}}</view>
								<view class="subtitle">{{item.status_name}}</view>
								<view class="price">{{item.salary}}</view>
								<view class="info">{{item.address}}</view>
							</view>
						</view>
					</view>
				</scroll-view>

				<!-- 二手交易 -->
				<scroll-view @scrolltolower="lower" scroll-y v-else enable-flex
					style="width: 100%;height: 100%;padding-bottom:10rpx;">

					<view class="second_hand" v-if="secondTrading.length > 0">
						<view class="item" v-for="item in secondTrading" :key="item.id">
							<view class="left_cover">
								<image :src="baseUrl + item.small_img_urls"></image>
							</view>
							<view class="right_info">
								<view class="name"><text>{{ item.name }}</text> </view>
								<view class="price">
									<view>
										<image src="/static/publicImg/phone.png" />
										{{ item.phone }}
									</view>
									<!-- <view @click="clickPhone" >待交易</view> -->
								</view>
								<view class="info">￥{{ item.price }}</view>
							</view>
						</view>
					</view>
					<view class="empty" v-else>
						<u-empty text="暂无二手交易数据" mode="list"></u-empty>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import secondHandApi from "../../network/secondHand/secondHand.js";
	import jobApi from "../../network/job/jobApi.js";
	export default {
		components: {},
		data() {
			return {
				//! 数据切换标题数据
				tabList: [{
						id: 1,
						title: '求职招聘',
					},
					{
						id: 2,
						title: '二手交易',
					}
				],
				current: 0, //! 默认选中的swiper下标
				baseUrl: "",
				//! 请求参数
				tradingQueryInfo: {
					user_id: getApp().globalData.wxuser.id,
					page_num: 1,
					page_size: 20,
					sort: 'id desc'
				},
				//! 用户的求职列表
				queryInfo:{
					user_id:getApp().globalData.wxuser.id,
					gender:getApp().globalData.wxuser.gender,
					page_num:1,
					page_size:20,
					sort: 'id desc'
				},
				//! 二手交易列表
				secondTrading: [],
				sendList:[]
			}
		},
		onLoad() {
			this.getList()
			this.baseUrl = getApp().globalData.requesturl
		},
		watch: {
			current() {
				//! 每次切换清除默认数据从新加载
				this.clearData();
				this.getList();
			}
		},
		methods: {
			getList() {
				let index = this.current
				switch (index) {
					case 0:
						this.getSendList()
						break;
					case 1:
						this.getScondTrading()
						break;
					default:
						// this.getScondTrading()
						break;
				}
			},
			//! 获取求职列表
			async getSendList() {
				const res = await jobApi.listJob(this.queryInfo);
				this.sendList = res.data.list;
			},
			//! 获取二手列表
			async getScondTrading() {
				const res = await secondHandApi.getList(this.tradingQueryInfo);
				this.secondTrading = [...this.secondTrading, ...res.data.list];
			},
			//! 按钮点击的切换
			changeTab(id, index) {
				this.current = index;
			},
			//! 滑动页面的切换
			change(e) {
				this.current = e.target.current;
			},
			//! 数据滚动到底部的监听
			lower() {},

			goDetail(id) {
				uni.navigateTo({
					url: "./secondHandDetail?id=" + id
				})
			},
			//! 清除默认数据
			clearData() {
				//! 请求参数
				this.tradingQueryInfo = {
					user_id: getApp().globalData.wxuser.id,
					page_num: 1,
					page_size: 20,
					sort: 'id desc'
				}
				//! 二手交易列表
				this.secondTrading = []
			}
		},

	}
</script>

<style lang="scss">
	.info_wrap {
		width: 100%;
		height: 100%;
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
			height: calc(100vh - 130rpx);
			overflow-y: scroll;
			padding: 0 10rpx 0 10rpx;
			box-sizing: border-box;

		}

		.list {
			padding: 22rpx;
			background-color: #fff;

			.item {
				display: flex;
				padding-bottom: 20rpx;

				.left_cover {
					width: 210rpx;
					@include flex-center;
					padding: 10rpx 0;

					image {
						width: 200rpx;
						height: 200rpx;
					}
				}

				.right_info {
					flex: 1;
					padding: 0 10rpx 0 15rpx;
					position: relative;

					.name {
						font-size: 34rpx;
						font-weight: 560;
						color: #38393b;
					}

					.subtitle {
						margin-top: 15rpx;
						font-size: 30rpx;
						font-weight: 560;
						color: #888888;
					}

					.price {
						width: 100%;
						font-weight: 560;
						text-align: right;
						color: #ffdf2c;
						padding-right: 10rpx;
					}

					.info {
						position: absolute;
						bottom: 0;
						left: 15rpx;
					}
				}
			}
		}

		.second_hand {
			padding: 22rpx;
			background-color: #fff;

			.item {
				display: flex;
				padding-bottom: 20rpx;

				.left_cover {
					width: 230rpx;
					height: 230rpx;
					@include flex-center;
					padding: 10rpx 10rpx;
					border: 2px solid #e3e3e3;

					image {
						width: 200rpx;
						height: 200rpx;
					}
				}

				.right_info {
					width: 100%;
					padding: 20rpx 10rpx 0 15rpx;
					position: relative;
					background-color: #fff;

					.name {
						font-size: 32rpx;
						font-weight: 560;
						color: #38393B;
						height: 80rpx;
					}


					.price {
						width: 100%;
						margin-top: 10rpx;
						padding-right: 10rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						view:nth-child(1) {
							color: red;
							position: relative;
							padding-left: 40rpx;

							image {
								width: 30rpx;
								height: 30rpx;
								position: absolute;
								left: 0;
								top: 50%;
								transform: translateY(-50%);
							}

						}

						view:nth-child(2) {
							color: #fff;
							background-color: #ffde2a;
							border-radius: 8rpx;
							padding: 8rpx 15rpx;
						}
					}

					.info {
						position: absolute;
						bottom: 0;
						left: 15rpx;
						color: #000;
						font-weight: 600;
					}
				}
			}
		}

	}
</style>
