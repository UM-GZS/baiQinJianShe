<template>
	<view class="container" v-if="detail">
		<view class="userInfo_wrap">
			<view class="user_cover">
				<image :src="userCover" />
			</view>
			<view class="user_info">
				<view>网友:{{detail.user_name}}</view>
				<view>发布于:{{detail.position}}</view>
			</view>
		</view>

		<view class="info">
			<view class="personal">{{detail.person_type_name}}</view>
			<view class="tag">{{detail.name}}</view>
		</view>
		<view class="price">
			￥{{detail.price}}
		</view>
		<view class="detal">
			<text>{{detail.info}}</text>
		</view>
		<view class="img">
			<image :src="baseUrl+item.img" v-for="(item,index) in detail.img_urls" :key="index" />
		</view>

		<!-- 底部按钮 -->
		<view class="footer">
			<view class="collect common" @click="handelCollection">
				<image src="../../static/user/collaction.png" style="width: 45rpx; height: 45rpx;" v-if="collect"
					@click="collect = false">
				</image>
				<image src="../../static/uview/common/collect.png" style="width: 45rpx; height: 45rpx;" v-else
					@click="collect = true"></image>
				<text>收藏</text>
			</view>
			<button open-type="share" class="contact common" style="margin-left: 30rpx;">
				<image src="../../static/information/share.png" style="width: 45rpx; height: 45rpx;"></image>
				<text>分享</text>
			</button>
			<view class="buy" @click="contactSeller">联系卖家</view>
		</view>
	</view>
</template>

<script>
	import API from "../../network/secondHand/secondHand"
	import userApi from "../../network/user/userApi.js"
	export default {
		data() {
			return {
				collect:false,
				pageId: '',
				detail: null,
				userCover: "",
				baseUrl: ""
			};
		},
		onLoad(options) {
			this.baseUrl = getApp().globalData.requesturl
			this.pageId = options.id
			this.getDetai()
		},
		methods: {
			getDetai() {
				let query = {
					id: this.pageId
				}

				API.detail(query).then(res => {
					res.data.img_urls = JSON.parse(res.data.img_urls)

					this.detail = res.data

					let userQuery = {
						id: res.data.user_id
					}
					userApi.detail(userQuery).then(res => {
						this.userCover = res.data.headpic_url
					})

				})

			},
			contactSeller() {
				uni.makePhoneCall({
					phoneNumber: this.detail.phone,
					fail(err) {
						console.warn(err)
					}
				})
			},
			handelCollection() {
				// console.log('收藏');
			},
		},
		onShareAppMessage(res) {
			return {
				title: this.detail.name,
				imageUrl: this.baseUrl + this.detail.small_img_urls,
				desc: '旋挖宝二手交易',
				path: `/subPackages/vehicleBuy/secondHandDetail?id=` + this.detail.id
			}
		}
	};
</script>

<style scoped lang="scss">
	.container {
		padding: 30rpx 30rpx;

		.userInfo_wrap {
			display: flex;

			.user_cover {
				@include flex-center;

				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}

			.user_info {
				padding: 5rpx 20rpx 5rpx 20rpx;
				display: flex;
				justify-content: space-between;
				flex-direction: column;

				view:nth-child(1) {
					color: #000;
				}

				view:nth-child(2) {
					color: #808080;
				}
			}
		}

		.info {
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			flex-wrap: wrap;

			.personal {
				background-color: #ffa02e;
				border-radius: 10rpx;
				padding: 5rpx 30rpx;
				color: #ffffff;
				margin-right: 30rpx;
				margin-top: 30rpx;
			}

			.tag {
				font-size: 30rpx;
				font-weight: 600;
				margin-right: 30rpx;
				margin-left: 30rpx;
				margin-top: 30rpx;
			}
		}

		.price {
			margin-top: 20rpx;
			width: 100%;
			color: red;
			font-size: 40rpx;
			font-weight: 600;
		}

		.detal {
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}

		.img {
			@include flex-center;
			width: 100%;
			flex-wrap: wrap;
			padding-bottom: 100rpx;

			image {
				width: 100%;
				border-radius: 10rpx;
				margin-bottom: 15rpx;
			}
		}

		//! 底部按钮
		.footer {
			width: 100%;
			height: 100rpx;
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
				// padding: 30rpx 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				text {
					margin-top: 5rpx;
				}
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
				color: black;
				font-size: 35rpx;
				border-radius: 50rpx;
				font-weight: 600;
			}
		}


	}
</style>
