<template>
	<view class="container">
		<view class="header flex flex_column flex_allcenter">
			<image src="../../static/index/logo.png"></image>
			<view>百勤建设</view>
			<view>物资管理系统</view>
		</view>
		<view class="footer flex flex_center">
			<view class="login_button" @click="login">登陆</view>
		</view>
	</view>
</template>

<script>
	import userApi from "../../network/user/userApi.js";
	export default {
		data() {
			return {

			}
		},
		methods: {
			async login() {
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
						getApp().globalData.wxuser = resData.data
						if (resData.data.active == 0 || resData.data.active == 3) {
							uni.navigateTo({
								url: "../user/certification"
							})
						} else if (resData.data.active == 1) {
							getApp().globalData.global_Toast(true, resData.msg, (res) => {})
						} else {
							uni.setStorageSync('wxuser', resData.data)
							uni.reLaunch({
								url: "../index/index"
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}
	
	.container {
		width: 100%;
	}
	
	.header {
		width: 100%;
		height: 600rpx;
		
		&>image {
			position: relative;
			width: 300rpx;
			height: 230rpx;
		}
		
		&>view {
			position: relative;
			top: -90rpx;
			font-size: 40rpx;
			color: #1D2087;
			font-weight: bold;
		}
	}
	
	.footer {
		margin-top: 200rpx;
		width: 100%;
		
		.login_button {
			width: 80%;
			height: 80rpx;
			background: #FEDE34;
			text-align: center;
			line-height: 80rpx;
			border-radius: 50rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
	}
</style>
