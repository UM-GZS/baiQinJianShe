<template>
	<view class="repair_wrap">
		<!-- 头部搜索框 -->
		<!-- 切换按钮 -->
		<view class="swiper_tab">
			<view class="tab_item" @click="changeTab(item.id,index)" v-for="(item,index) in tabList" :key="index">
				<text style="margin-left: 10rpx;"
					:style="current === index ? 'color:black':'color:$gray_color'">{{ item.title }}</text>
			</view>
		</view>

		<!-- 内容区域 -->
		<swiper @change="change" :current="current" class="swiper_content" enable-flex>
			<swiper-item v-for="(swiperItem,swiperIndex) in tabList" :key="swiperIndex" class="swiper_item">
				<!-- 每一项内容区域 -->
				<scroll-view @scrolltolower="lower" style="width: 100%;height: 100%;" scroll-y enable-flex>
					<view class="info_item" v-for="(item,index) in list" :key="index">
						<!-- 图片以及文字内容 -->
						<view class="info_content">
							<view class="left_pic">
								<image style="width: 100%;height: 100%;" :src="imgUrl[index]">
								</image>
							</view>
							<view class="right_msg">
								<view class="title">
									{{ item.info }}
								</view>
								<view class="status">
									<text>待维修</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	//导入网络请求 
	import userApi from "../../../network/user/userApi.js";
	export default {
		data() {
			return {
				url: getApp().globalData.requesturl,
				//! 数据切换标题数据
				tabList: [{
						id: 1,
						title: '全部'
					},
					{
						id: 2,
						title: '待维修'
					},
					{
						id: 3,
						title: '已维修'
					}
				],
				//! 请求参数
				queryInfo: {
					page_num: 1,
					page_size: 20
				},
				//! 总共的页数
				total: null,
				//! 默认选中的swiper下标
				current: 0,
				list: [],
				//! 图片列表
				imgUrl:[]
			}
		},
		onLoad() {
			this.getRepairList();
		},
		methods: {
			/**
			 * 获取维修记录列表
			 */
			async getRepairList() {
				//拼接请求参数
				let params = {
					user_id: getApp().globalData.wxuser.id,
					...this.queryInfo
				}
				const res = await userApi.repairList(params);
				
				//! 遍历图片追加数组
				this.formatPic(res.data.list);
				//! 记录总共的数据
				this.total = res.data.total;
				this.list = res.data.list;
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
			changeTab(id, index) {
				console.log(id);
				this.current = index;
			},
			//! 滑动页面的切换
			change(e) {
				this.current = e.target.current;
			},
			//! 数据滚动到底部的监听
			lower() {
				console.log("到达底部");
			}
		},

	}
</script>

<style lang="scss">
	.repair_wrap {
		width: 100%;
		height: 100%;

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

						.status {
							margin-top: 20rpx;
							margin-bottom: 20rpx;
							padding: 10rpx 30rpx;
							color: #ffffff;
							font-size: 28rpx;
							background-color: $page_color;
							align-self: flex-end;
						}
					}
				}
			}
		}
	}
</style>
