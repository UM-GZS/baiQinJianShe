<template>
	<view class="discount_wrap">
		<view class="discount_info">
			<head-title title="商品特惠" img="../../static/index/car.png"></head-title>
			<!--商品打折内容 -->
			<view class="discount_list">
				<view class="discount_item" v-for="(item,index) in list" :key="index" @click="detail(item)">
					<!--  头部照片 -->
					<view class="pic">
						<image style="width: 100%;height: 100%;" :src="baseUrl + item.small_img_urls"></image>
					</view>
					<!-- 产品描述 -->
					<view class="info">
						{{ item.name }}
					</view>
					<!-- 产品价格 -->
					<view class="price">
						￥{{ item.price }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import headTitle from "@/components/head-title/head-title.vue"
	import categoryApi from "../../../network/category/category.js";
	export default {
		components: {
			headTitle
		},
		data() {
			return {
				baseUrl:getApp().globalData.requesturl,
				list:[]
			}
		},
		created() {
			this.getGoodsList()
		},
		methods: {
			 async getGoodsList() {
				let  queryInfo = {
					page_num:1,
					page_size:6,
					sort:'sales desc'
				}
				const res = await categoryApi.goodsList(queryInfo);
				this.list = res.data.list;
			},
			//! 获取详情
			detail(item) {
				uni.navigateTo({
					url:`/subPackages/category/category_detail?order_types=2&id=${item.id}`,
					fail(err) {
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.discount_wrap {
		width: 100%;
		height: 100%;
		padding: 0 30rpx;
		.discount_info {
			width: 100%;
			.discount_list {
				width: 100%;
				padding: 30rpx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.discount_item {
					flex: 0 0 31%;
					// padding: 20rpx 20rpx 2rpx 20rpx;
					margin-bottom: 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					background-color: #ffffff;
					border-radius: 15rpx;
					.pic {
						width: 100%;
						height: 160rpx;
						// border: 1rpx solid #bbbbbb;
						margin-bottom: 10rpx;
						image {
							border-top-left-radius: 15rpx;
							border-top-right-radius: 15rpx;
						}
					}
					.info {
						width: 100%;
						// margin-top: 10rpx;
						font-size: 22rpx;
						padding-left: 20rpx;
						color: #38393B;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
					.price{
						margin-top: 5rpx;
						padding-left: 20rpx;
						align-self: flex-start;
						font-size: 28rpx;
						color: #ff2400;
						font-weight: 700;
					}
				}
			}
		}
	}
</style>
