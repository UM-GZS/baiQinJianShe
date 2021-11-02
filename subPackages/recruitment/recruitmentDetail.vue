<template>
	<view class="recruitment_detail">
		<!--消息模块 -->
		<view class="header_info">
			<view class="company">
				<view class="brand">
					旋挖机有限公司
				</view>
				<view class="count">
					200人
				</view>
			</view>
			<view class="position">
				<view class="post_name">
					挖机师傅
				</view>
				<view class="salary">
					15-20k
				</view>
			</view>
			<view class="treatment">
				<text class="treatment_item">工作经验不限</text>
				<text class="treatment_item">学历不限</text>
				<text class="treatment_item">全职</text>
			</view>
			<view class="welfare">
				<view class="welfare_item">
					节日补贴
				</view>
				<view class="welfare_item">
					带薪年假
				</view>
				<view class="welfare_item">
					餐补
				</view>
			</view>
		</view>
		<!--职位详情 -->
		<view class="detail">
			<view class="detail_title">
				岗位详情
			</view>
			<view class="content">
				<text>工作职责</text>
				<br>
				<text>1.安全高效接/送货物，保障车辆行驶安全。</text>
				<br>
				<text>2.对外协助客户装卸货。</text>
				<br>
				<text>3.有服务意识，能够协助客户处理一些简单问题。</text>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="collect common" >
				<image src="../../static/user/collaction.png" style="width: 50rpx; height: 50rpx;" v-if="collect" @click="collect = false">
				</image>
				<image src="../../static/uview/common/collect.png" style="width: 50rpx; height: 53rpx;" v-else @click="collect = true"></image>
				<text>收藏</text>
			</view>
			<button open-type="contact" class="contact common" style="margin-left: 30rpx;">
				<image src="../../static/user/server.png" style="width: 50rpx; height: 50rpx;"></image>
				<text>客服</text>
			</button>
			<view class="buy" @click="contactSeller">联系企业</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collect:false,
				phone:"183189962967"
			}
		},
		methods: {
			contactSeller() {
				uni.makePhoneCall({
					phoneNumber:this.phone,
					fail(err) {
						console.warn(err)
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.recruitment_detail {
		width: 100%;
		padding: 30rpx 0;

		.header_info {
			width: 100%;
			padding: 30rpx 20rpx;
			background-color: #ffffff;

			.company {
				width: 100%;
				display: flex;
				font-size: 35rpx;
				font-weight: 800;

				.count {
					margin-left: 30rpx;
				}
			}

			.position {
				margin-top: 20rpx;
				font-size: 30rpx;
				font-weight: 300;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.salary {
					font-size: 32rpx;
					font-weight: 600;
					color: $page_color;
				}
			}

			.treatment {
				width: 100%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.treatment_item {
					padding: 0 30rpx;
					color: $gray_color;
					font-size: 23rpx;
					margin-top: 20rpx;
					border-right: 1rpx solid $gray_color;

					&:nth-child(1) {
						padding-left: 0;
					}

					&:nth-last-child(1) {
						border-right: 0;
					}
				}

			}

			.welfare {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;

				.welfare_item {
					padding: 10rpx 20rpx;
					font-size: 25rpx;
					color: #fd5d3a;
					border-radius: 15rpx;
					background-color: #ffe7cf;
					margin-right: 15rpx;

					&:nth-last-child(1) {
						margin-right: 0;
					}
				}
			}
		}

		.detail {
			width: 100%;
			margin-top: 30rpx;
			padding: 30rpx 20rpx;
			background-color: #ffffff;

			.detail_title {
				font-size: 35rpx;
				font-weight: 800;
			}

			.content {
				line-height: 60rpx;
			}
		}
		//! 底部按钮
		.footer {
			width: 100%;
			height: 90rpx;
			position: fixed;
			display: flex;
			align-items: center;
			padding: 10rpx 30rpx;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1000;
			background-color: #ffffff;
			font-size: 25rpx;
			color: $gray_color;
		
			.common {
				padding: 30rpx 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
		
			.contact {
				line-height: 1.1;
				margin: 0;
				padding: 0;
				font-size: 25rpx;
				color: $gray_color;
				background-color: transparent;
		
				&::after {
					border: none;
				}
			}
		
			.buy {
				height: 100%;
				margin-left: 30rpx;
				flex: 1;
				background-color: $page_color;
				@include flex-center;
				font-weight: 500;
				color: black;
				font-size: 35rpx;
				border-radius: 50rpx;
			}
		}
	}
</style>
