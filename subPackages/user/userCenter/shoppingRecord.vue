<template>
	<view class="shopping_wrap">
		<!-- 头部搜索框 -->
		<!-- 切换按钮 -->
		<view class="swiper_tab">
			<view class="tab_item" @click="changeTab(item.status,index)" v-for="(item,index) in tabList" :key="index">
				<text style="margin-left: 10rpx;"
					:style="current === index ? 'color:black':'color:$gray_color'">{{ item.title }}</text>
			</view>
		</view>

		<!-- 内容区域 -->
		<swiper @change.stop="change" :current="current" class="swiper_content" enable-flex>
			<swiper-item v-for="(swiperItem,swiperIndex) in tabList" :key="swiperIndex" class="swiper_item">
				<!-- 每一项内容区域 -->
				<scroll-view v-if="list.length > 0" @scrolltolower="lower" style="width: 100%;height: 100%;" scroll-y enable-flex>
					<view class="info_item" v-for="(item,index) in list" :key="index">
						<!-- 图片以及文字内容 -->
						<view class="info_content">
							<view class="left_pic">
								<image style="width: 100%;height: 100%;" :src="url + item.items[0].img_url">
								</image>
							</view>
							<view class="right_msg">
								<view class="title">
									订单类型:{{ item.order_types_name }}
								</view>
								<view class="goods_name">
									{{ item.items[0].goods_name }}
								</view>
								<!-- 信息内容 -->
								<view class="other_msg">
									<!-- 价格 -->
									<view class="price">
										总价:{{ item.act_pay }}
									</view>
									<view class="status">
										<text v-if="item.status === 1">待付款</text>
										<text v-if="item.status === 2">待发货</text>
										<text v-if="item.status === 3">待收货</text>
										<text v-if="item.status === 5">已完成</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- 显示为空 -->
				<view class="empty">
					<u-empty text="暂无数据" mode="list"></u-empty>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	//导入网络请求 
	import userApi from "../../../network/user/userApi.js";
	import orderApi from "../../../network/order/order.js";
	export default {
		data() {
			return {
				url: getApp().globalData.requesturl,
				//! 数据切换标题数据
				tabList: [
					{
						id: 1,
						title: '全部',
						status:0
					},
					{
						id: 2,
						title: '待付款',
						status:1
					},
					{
						id: 3,
						title: '待发货',
						status:2
					},
					{
						id: 4,
						title: '待收货',
						status:3
					},
					{
						id: 5,
						title: '已完成',
						status:5
					}
				],
				//! 请求参数
				queryInfo: {
					user_id:getApp().globalData.wxuser.id,
					page_num: 1,
					page_size: 10,
					status:0,
					sort:'id desc'
				},
				// 判断是否还有更多数据
				hasMore:true,
				//! 总共的页数
				total: null,
				//! 默认选中的swiper下标
				current: 0,
				// 订单列表
				list: [],
				//! 图片列表
				imgUrl:[]
			}
		},
		onLoad() {
			this.getOrderList();
		},
		methods: {
			// 获取用户订单
			async getOrderList() {
				const res = await orderApi.orderList(this.queryInfo);
				if(this.queryInfo.page_num * this.queryInfo.page_size >= res.data.total) {
					this.hasMore = false;
				}
				this.list = [...this.list,...res.data.list];
			},
			/**
			 * 转换图片追加到数组中
			 */
			formatPic(list) {
				for(let i = 0;i < list.length;i++) {
				 this.imgUrl.push(this.url + JSON.parse(list[i].urls)[0].img)
				}
			},
			//! 按钮点击的切换
			changeTab(status, index) {
				this.current = index;
			},
			//! 滑动页面的切换
			change(e) {
				//!清除数据
				this.clearData();
				// 获取对应的status
				this.queryInfo.status = this.tabList[e.target.current].status;
				console.log(this.tabList[e.target.current].status)
				this.current = e.target.current;
				this.getOrderList();
			},
			//! 数据滚动到底部的监听
			lower() {
				if(this.hasMore) {
					this.queryInfo.page_num ++;
					this.getOrderList();
				}
			},
			//! 清除数据
			clearData() {
				this.queryInfo = {
					user_id:getApp().globalData.wxuser.id,
					page_num: 1,
					page_size: 10,
					status:1,
					sort:'id desc'
				}
				this.list = []
				this.hasMore = true
			}
		},

	}
</script>

<style lang="scss">
	.shopping_wrap {
		width: 100%;
		height: 100%;

		.swiper_tab {
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
			// height: 100%;
			overflow-y: scroll;
			// padding: 0 20rpx;
			box-sizing: border-box;
			
			.swiper_item {
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
				padding: 30rpx;
				margin-bottom: 10rpx;

				//! 图片以及文字内容
				.info_content {
					width: 100%;
					margin: 20rpx 0;
					display: flex;
					align-items: flex-start;

					.left_pic {
						width: 200rpx;
						height: 200rpx;
						border: 1rpx solid #bbbbbb;
					}

					.right_msg {
						flex: 1;
						margin-left: 10rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.title {
							width: 100%;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							font-size: 30rpx;
							font-weight: 600;
							overflow: hidden;
						}
						.goods_name {
							width: 100%;
							margin:20rpx 0;
							font-size: 28rpx;
						}

						.other_msg {
							width: 100%;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.status {
								margin-top: 20rpx;
								margin-bottom: 20rpx;
								padding: 10rpx 30rpx;
								color: #ffffff;
								font-size: 28rpx;
								background-color: $page_color;
								align-self: flex-end;
							}
							.price {
								font-size: 30rpx;
								font-weight: 700;
								color: red;
							}
						}
					}
				}
			}
			//内容为空显示
			.empty {
				width: 100%;
				height: 100%;
				@include flex-center;
			}
		}
	}
</style>
