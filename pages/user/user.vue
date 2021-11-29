<template>
	<view class="user_wrap">
		<!-- 用户信息 -->
		<view class="user_info">
			<view class="right_cover" @click="login">
				<image :src="userInfo.headpic_url" mode=""></image>
			</view>
			<view class="left_info" @click="login">
				<view class="name">{{userInfo.rname}}</view>
				<view class="progress" v-if="hasLogin">
					<view>职务：{{userInfo.description || ''}}</view>
				</view>
				<view class="progress" v-else>点击头像进行登录</view>
			</view>
			<view class="user_right">
				<image src="../../static/index/more.png" @click="goUserCenter" v-if="hasLogin"></image>
			</view>
		</view>
		<view class="nav_list flex flex_column flex_middle">
			<view class="nav_item flex flex_middle" @click="goOrder">
				<image src="/static/user/order.png" mode="aspectFit"></image>
				<text>订单中心</text>
			</view>
			<view class="nav_item flex flex_middle" @click="goAddress">
				<image src="/static/user/address_position.png" mode="aspectFit"></image>
				<text>收货地址</text>
			</view>
			<button class="customer flex flex_center" open-type="contact">
				<view class="nav_item flex flex_middle">
					<image src="/static/user/server.png" mode="aspectFit"></image>
					<text>联系客服</text>
				</view>
			</button>
			<view class="nav_item flex flex_middle" @click="exit" v-if="hasLogin">
				<image src="/static/user/exit.png" mode="aspectFit"></image>
				<text>退出登录</text>
			</view>
		</view>
		<!-- 登陆后没有手机号时弹出 -->
		<u-modal v-model="addPhoneShow" :show-cancel-button="true" confirm-text="确定" title="完善手机号" @cancel="cancel" @confirm="edituserInfo">
			<view style="padding:40rpx">
				<input type="number" v-model="phone" placeholder="填写手机号" />
			</view>
		</u-modal>
	</view>
</template>

<script>
	import userApi from "../../network/user/userApi.js";
	import validity from "../../utils/validate/validity.js";
	export default {
		data() {
			return {
				hasLogin: false,
				code: "",
				userInfo: {
					uname: "未登录",
					headpic_url: "../../static/tabBar/user.png",
					phone: "请登录获取手机号码"
				},
				addPhoneShow: false,
				phone: "" //用户手机号
			}
		},
		methods: {
			ontrueGetList() {
				let that = this
				let wxuser = uni.getStorageSync('wxuser')
				//! 记录用户数据
				this.hasLogin = wxuser;
				if (wxuser) {
					this.userInfo = wxuser
				}
			},

			//! 用户登录
			async login() {
				let that = this
				let wxuser = uni.getStorageSync('wxuser')
				if (wxuser.phone) {
					return
				}

				let code = ''
				uni.login({
					success(resCode) {
						code = resCode.code
					}
				})
				uni.getUserProfile({
					desc: '微信一键登录',
					lang: 'zh_CN',
					success: async res => {
						let query = {
							code: code,
							userHead: res.userInfo.avatarUrl,
							userName: res.userInfo.nickName,
							userGender: res.userInfo.gender, // 0:未知,1:男,2:女
							userCity: res.userInfo.city,
							userProvince: res.userInfo.province
						}
						let resData = await userApi.login(query)
						//! 存储到全局
						uni.setStorageSync('wxuser', resData.data)
						getApp().globalData.wxuser = resData.data
						that.userInfo = resData.data
						if (!resData.data.phone) {
							that.addPhoneShow = true
						}
						//! 显示退出按钮
						this.hasLogin = true
					}
				}) //getUserProfile end
			},
			goAddress() {
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				}
				uni.navigateTo({
					url: "/pages/address/address"
				})
			},
			goOrder() {
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				}
				uni.navigateTo({
					url: "/pages/user/order_center"
				})
			},
			goUserCenter() {
				//! 判断用户是否登录
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				} else {
					uni.navigateTo({
						url: "/pages/user/user_tenter"
					})
				}
			},
			// 修改用户信息
			edituserInfo() {
				/**
				 * 判断用户输入手机号码
				 */
				if (!validity.validPhone(this.phone)) {
					this.addPhoneShow = true;
					return getApp().globalData.global_Toast(true, "请输入正确的手机号码", function(res) {})
				}
				let that = this;
				let query = {
					phone: this.phone,
					id: this.userInfo.id
				}
				userApi.editUserInfo(query).then(res => {
					//! 修改用户信息
					if (res.code === 200) {
						this.addPhoneShow = false;
						getApp().globalData.global_Toast(true, "成功添加手机号码", function(res) {})
					};
					//! 重新获取用户的信息
					let params = {
						id: that.userInfo.id
					}
					userApi.detail(params).then(userInfo => {
						uni.setStorageSync('wxuser', userInfo.data)
						getApp().globalData.wxuser = userInfo.data
						that.userInfo = userInfo.data
					})
				})
			},
			cancel() {
				uni.showToast({
					title: "请在个人中心页完善信息",
					icon: "none"
				})
			},
			//! 用户退出登录
			exit() {
				//! 清除缓存数据
				wx.removeStorageSync("wxuser");
				getApp().globalData.wxuser = null;
				//! 清除数据
				this.userInfo = {
						uname: "未登录",
						headpic_url: "../../static/tabBar/5.png",
						phone: "请登录获取手机号码"
					},
					this.hasLogin = false
				this.addPhoneShow = false
				this.phone = "" //用户手机号
				setTimeout(() => {
					uni.reLaunch({
						url: "../login/login"
					}, 1000)
				})
			}
		}

	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.user_wrap {
		width: 100vw;


		// 用户信息
		.user_info {
			width: 100%;
			height: 300rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 40rpx 70rpx 40rpx;
			background-color: $page_color;
			border-bottom-left-radius: 50rpx;
			border-bottom-right-radius: 50rpx;

			.left_info {
				width: 330rpx;
				display: flex;
				flex-direction: column;

				.name {
					font-weight: 600;
					font-size: 40rpx;
				}

				.phone {
					padding-top: 10rpx;
					font-size: 30rpx;
				}
			}

			.right_cover {
				height: 140rpx;
				width: 140rpx;
				border-radius: 50%;
				border: 2rpx solid #e3e3e3;
				@include flex-center;

				image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
				}
			}
		}
	}

	.progress {
		margin-top: 10rpx;
	}

	.user_right {
		width: 120rpx;
		height: 50rpx;
		text-align: right;

		&>image {
			width: 32rpx;
			height: 50rpx;
		}
	}

	.nav_list {
		margin-top: 50rpx;
		width: 100%;

		.customer {
			width: 100%;
			margin: 0;
			padding: 0;
			background-color: transparent;

			&::after {
				border: none;
			}
		}

		.nav_item {
			margin-top: 40rpx;
			width: 80%;
			height: 120rpx;
			border: 4px solid #FFDF2C;
			border-radius: 100rpx;
			font-size: 35rpx;

			&>image {
				margin: 0rpx 100rpx 0rpx 100rpx;
				width: 70rpx;
				height: 55rpx;
			}
		}
	}
</style>
