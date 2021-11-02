<template>
	<view class="recruit_wrap">
		<view class="recruit_info">
			<head-title title="招聘信息" img="../../static/index/recruit2.png"></head-title>
			<view class="recruit_list">
				<view class="recruit_item" @click="detail(item)"  v-for="(item,index) in list" :key="index">
					<!-- 左边产品图片 -->
					<view class="left_img">
						<image style="width: 100%;height: 100%;" src="https://www.yuanhao.work/dl/img/97d884dc427142983f711d64b4dcb28194c0174f.jpeg@639w_360h.jpeg"></image>
					</view>
					<!-- 右边产品信息 -->
					<view class="right_info">
						<view class="head">
							<view class="title">旋挖机师傅</view>
							<!-- <view class="money" style="color:#FDDF2F;">15K-20K</view> -->
						</view>
						<view class="content">泽豪公司 200人</view>
						<!-- 操作描述 -->
						<view class="other">
							<view class="location common">北京</view>
							<view class="experience common">1年</view>
							<view class="educator common">学历不限</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import headTitle from "@/components/head-title/head-title.vue"
	export default {
		components: {
			headTitle
		},
		data() {
			return {
				list:[{},{}]
			}
		},
		methods: {
			detail(items) {
				uni.navigateTo({
					url:"/subPackages/recruitment/recruitmentDetail"
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.recruit_wrap {
		width: 100%;
		height: 100%;
		padding: 0 30rpx;

		.recruit_info {
			width: 100%;

			.recruit_list {
				width: 100%;
				padding: 30rpx 0;

				.recruit_item {
					width: 100%;
					background-color: #ffffff;
					border-radius: 15rpx;
					padding: 30rpx 20rpx;
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;

					.left_img {
						border: 1rpx solid #b3b3b3;
						width: 127rpx;
						height: 127rpx;
					}

					.right_info {
						flex: 1;
						width: 100%;
						height: 100%;
						margin-left: 20rpx;
						// padding-top:20rpx;

						//! 头部标题
						.head {
							width: 100%;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.title {
								font-weight: 700;
								font-size: 32rpx;
							}

							.money {
								font-weight: 700;
								font-size: 28rpx;
							}
						}

						//! 中间内容
						.content {
							width: 100%;
							margin-top: 15rpx;
							margin-bottom: 15rpx;
							color: #808080;
							font-size: 26rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.other {
							width: 100%;
							color: #808080;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							font-size: 26rpx;
						}
						//! 公共样式
						.common {
							padding:0 20rpx;
							border-right: 2rpx solid $gray_color;
							&:nth-child(1) {
								padding-left: 0;
							}
							&:nth-last-child(1) {
								border-right: none;
							}
						}
					}
				}
			}
		}
	}
</style>
