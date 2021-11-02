<template>
	<view class="hot_wrap">
		<view class="hot_info">
			<head-title title="热点推送" img="../../static/index/hot.png"></head-title>
			<view class="hot_list">
				<view class="hot_item" @click="detail(item)" v-for="(item,index) in hotList" :key="index">
					<!-- 左边产品图片 -->
					<view class="left_img">
						<image style="width: 100%;height: 100%;" :src="baseUrl + item.small_img_urls"></image>
					</view>
					<!-- 右边产品信息 -->
					<view class="right_info">
						<view class="head">
							<view class="title">{{ item.name }}</view>
							<view class="time">{{ item.create_time | filterDate }}</view>
						</view>
						<view class="content" v-html="item.info"></view>
						<!-- 操作描述 -->
						<view class="other" style="font-size: 24rpx;">
							<view class="name" style="display: flex;align-items: center;margin-right: 30rpx;">
								<image :src="baseUrl + item.user_url" style="width: 25rpx;height: 25rpx;"></image>
								<text style="margin-left: 10rpx;">{{ item.user_name }}</text>
							</view>
							<view class="through" style="display: flex;align-items: center;">
								<image src="../../../static/index/see.png" style="width: 30rpx;height: 20rpx;"></image>
								<text style="margin-left: 10rpx;">{{ item.comments }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import headTitle from "@/components/head-title/head-title.vue"
	import articleApi from "../../../network/article/article.js";
	export default {
		components: {
			headTitle
		},
		data() {
			return {
				hotList:[],
				baseUrl:getApp().globalData.requesturl
			}
		},
		filters: {
			filterDate: function(value) {
				return getApp().globalData.formatDate1(value);
			}
		},
		created() {
			this.getArticle();
		},
		methods: {
			//! 获取文章
			async getArticle() {
				let queryInfo = {
					page_num:1,
					page_size:2,
					sort:'id desc'
				}
				const res = await articleApi.articleList(queryInfo);
				this.hotList = res.data.list;
			},
			//! 跳转详情
			detail(item) {
				//! 判断用户是否完成登录
				if(!getApp().globalData.wxuser) {
					this.$emit('userLogin');
					return;
				}
				uni.navigateTo({
					url:`/subPackages/information/informationDetail?id=${item.id}`,
					fail(err) {
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	//! 热点推送
	.hot_wrap {
		width: 100%;
		height: 100%;
		padding: 0 30rpx;
		margin-top: 210rpx;
		.hot_info {
			width: 100%;
			.hot_list {
				width: 100%;
				padding: 30rpx 0;
				.hot_item {
					width: 100%;
					background-color: #ffffff;
					border-radius: 15rpx;
					padding: 30rpx 20rpx;
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					.left_img{
						border: 1rpx solid #b3b3b3;
						width: 127rpx;
						height: 127rpx;
						align-self: flex-start;
					}
					.right_info {
						flex: 1;
						width: 100%;
						height: 100%;
						margin-left: 20rpx;
						//! 头部标题
						.head {
							width: 100%;
							display: flex;
							justify-content: space-between;
							align-items: center;
							
							.title {
								flex: 1;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
								overflow: hidden;
								font-weight: 700;
								font-size: 32rpx;
							}
							.time {
								width: 150rpx;
								text-align: right;
								font-weight: 500;
								font-size: 25rpx;
								color: $gray_color;
							}
						}
						//! 中间内容
						.content {
							width: 100%;
							margin-top: 15rpx;
							margin-bottom: 15rpx;
							color: #808080;
							display: -webkit-box;
							font-size: 26rpx;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						.other {
							width: 100%;
							color: $gray_color;
							display: flex;
							justify-content: flex-end;
							align-items: center;
						}
					}
				}
			}
		}
	}
</style>
