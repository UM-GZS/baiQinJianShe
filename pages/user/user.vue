<template>
	<view class="user_wrap">

		<!-- 用户信息 -->
		<view class="user_info">
			<view class="right_cover" @click="login">
				<image :src="userInfo.headpic_url" mode=""></image>
			</view>
			<view class="left_info" @click="login">
				<view class="name">{{userInfo.uname}}</view>
				<view class="progress" v-if="hasLogin">
					<view class="progress_text flex flex_between">
						<view>{{userInfo.user_level_name}}会员</view>
						<view>{{userInfo.user_experience}}/{{barData[userInfo.user_level]}}</view>
					</view>
					<view class="progress_bar">
						<view class="bar_item" :style="progressBar"></view>
					</view>
				</view>
				<view class="progress" v-else>点击头像进行登录</view>
				<!-- <text class="phone">{{userInfo.phone}}</text> -->
			</view>
			<view class="user_right">
				<image src="../../static/index/more.png" @click="goUserCenter" v-if="hasLogin"></image>
			</view>
		</view>
		<!-- 发布和收藏 -->
		<view class="send_collection_wrap">
			<view class="send_collection_ctrl flex flex_space">
				<!-- <view class="" @click="goMySend">
					<image src="/static/user/send.png" mode=""></image>
					<text>我的发布</text>
				</view> -->
				<view class="" @click="goMyCart">
					<image src="/static/user/cart.png" mode="" class="ctrl_image"></image>
					<text>购物车</text>
				</view>
				<view @click="goMyCollection">
					<image src="/static/user/collaction.png" mode=""></image>
					<text>我的收藏</text>
				</view>
			</view>
		</view>
		<!-- 按钮控制 -->
		<view class="btn_control">
			<u-cell-group>
				<!-- <u-cell-item title="个人中心" :arrow="false" @click="goUserCenter">
					<u-image width="40rpx" height="40rpx" style="margin-right: 15rpx;" src="/static/user/usercenter.png"
						slot="icon"></u-image>
				</u-cell-item> -->
				<!-- <u-cell-item title="我的车辆" :arrow="false" @click="goMyVehicle">
					<u-image width="40rpx" height="40rpx" style="margin-right: 15rpx;" src="/static/user/cheliang.png"
						slot="icon" mode="aspectFit"></u-image>
				</u-cell-item> -->
				<u-cell-item title="订单中心" :arrow="false" @click="goOrder">
					<u-image width="40rpx" height="40rpx" style="margin-right: 15rpx;" src="/static/user/order.png" slot="icon" mode="aspectFit"></u-image>
				</u-cell-item>
				<!-- <u-cell-item title="认证信息" @click="goProve" :arrow="false">
					<u-image width="40rpx" height="40rpx" style="margin-right: 15rpx;"
						src="/static/user/renzhengxinxi.png" slot="icon" mode="aspectFit"></u-image>
				</u-cell-item> -->
				<u-cell-item title="收货地址" :arrow="false" @click="goAddress">
					<u-image width="40rpx" height="40rpx" style="margin-right: 15rpx;" src="/static/user/address_position.png" slot="icon" mode="aspectFit"></u-image>
				</u-cell-item>
				<button class="customer" open-type="contact">
					<u-cell-item title="联系客服" :arrow="false">
						<u-image width="40rpx" height="40rpx" style="margin-right: 15rpx;" src="/static/user/server.png"
							slot="icon" mode="aspectFit"></u-image>
					</u-cell-item>
				</button>
				<u-cell-item title="退出登录" :arrow="false" @click="exit" v-if="hasLogin">
					<u-image width="40rpx" height="40rpx" style="margin-right: 15rpx;" src="/static/user/exit.png" slot="icon" mode="aspectFit"></u-image>
				</u-cell-item>
			</u-cell-group>
		</view>
		<!-- 登陆后没有手机号时弹出 -->
		<u-modal v-model="addPhoneShow" :show-cancel-button="true" confirm-text="确定" title="完善手机号" @cancel="cancel"
			@confirm="edituserInfo">
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
				hasLogin:false,
				code: "",
				userInfo: {
					uname: "未登录",
					headpic_url: "../../static/tabBar/5.png",
					phone: "请登录获取手机号码"
				},
				barData: [9999, 49999, 99999, 499999],
				addPhoneShow: false,
				phone: "" //用户手机号
			}
		},
		computed: {
			progressBar() {
				if (this.userInfo.user_experience >= this.barData[this.userInfo.user_level]) return 'width: 100%';
				return `width: ${this.userInfo.user_experience / this.barData[this.userInfo.user_level] * 100}%`
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
						console.log(resCode, 88)
						code = resCode.code
					}
				})
				uni.getUserProfile({
					desc: '微信一键登录',
					lang: 'zh_CN',
					success: async res => {
						console.log(res, 99)
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
				if(!getApp().globalData.wxuser) {
					this.login();
					return ;
				}
				uni.navigateTo({
					url: "/pages/address/address"
				})
			},
			goOrder() {
				if(!getApp().globalData.wxuser) {
					this.login();
					return ;
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
				}else {
					uni.navigateTo({
						url:"/pages/user/user_tenter"
					})
				} 
				
			},
			// 修改用户信息
			edituserInfo() {
				/**
				 * 判断用户输入手机号码
				 */
				if(!validity.validPhone(this.phone)) {
					this.addPhoneShow = true;
					return getApp().globalData.global_Toast(true,"请输入正确的手机号码",function(res){})
				}
				let that = this;
				let query = {
					phone: this.phone,
					id: this.userInfo.id
				}
				userApi.editUserInfo(query).then(res => {
					//! 修改用户信息
					if(res.code === 200) {
						this.addPhoneShow = false;
						getApp().globalData.global_Toast(true,"成功添加手机号码",function(res){})
					};
					//! 重新获取用户的信息
					let params = {
						id:that.userInfo.id
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
			goMyCart(){
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				}
				uni.navigateTo({
					url: "../../subPackages/cart/cart"
				})
			},
			goMySend(){
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				}
				uni.navigateTo({
					url: "../../subPackages/mySend/mySend"
				})
			},
			goMyVehicle(){
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				}
				uni.navigateTo({
					url: "../../subPackages/vehicleBuy/MyVehicle"
				})
			},
			goMyCollection(){
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				}
				uni.navigateTo({
					url: "../../subPackages/collection/collectionIndex"
				})
			},
			goProve() {
				if (!getApp().globalData.wxuser) {
					this.login();
					return;
				}
				uni.navigateTo({
					url:"../../subPackages/user/prove"
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
				this.phone =  "" //用户手机号
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

		// 发布和收藏
		.send_collection_wrap {
			width: 100%;
			margin-top: -70rpx;
			@include flex-center;

			.send_collection_ctrl {
				width: 650rpx;
				padding: 30rpx 50rpx;
				background-color: #FFFFFF;
				box-shadow: #dddddd 0px 0px 20rpx;
				// @include flex-jcsb;

				view {
					@include flex-col;
					align-items: center;

					&>image {
						width: 60rpx;
						height: 60rpx;
						padding-bottom: 20rpx;
					}
					
					.ctrl_image {
						width: 72rpx;
						height: 56rpx;
					}
				}
			}

		}

		// 按钮操作
		.btn_control {
			padding-top: 40rpx;
			// 去除联系客服样式
			.customer {
				margin: 0;
				padding: 0;
				background-color: transparent;
				&::after{
					border: none;
				}
			}
			
			/deep/ .u-border-bottom:after,
			.u-border-left:after,
			.u-border-right:after,
			.u-border-top-bottom:after,
			.u-border-top:after,
			.u-border:after {
				border-bottom: 5rpx solid #e3e3e3;
			}
		}
	}
	
	.progress {
		margin-top: 10rpx;
	}
	
	.progress_text {
		font-size: 20rpx;
	}
	
	.progress_bar {
		margin-top: 10rpx;
		width: 332rpx;
		height: 16rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		
		.bar_item {
			height: 16rpx;
			background: #9090F4;
			border-radius: 16rpx;
		}
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
</style>
