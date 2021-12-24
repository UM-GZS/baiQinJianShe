<template>
	<view class="content">
		<view :style="{'display':show_index == 0?'block':'none'}">
			<category ref="category"></category>
		</view>
		<!-- 购物车 -->
		<view :style="{'display':show_index == 1 ?'block':'none'}">
			<cart ref="cart"></cart>
		</view>
		<!-- 个人中心 -->
		<view :style="{'display':show_index == 2 ? 'flex':'none'}">
			<user :style="{'display':show_index == 2 ? 'flex':'none'}" ref="user"></user>
		</view>
		<!-- is_lhp判断是否为刘海屏在main.js里，好像uniapp有一个css变量获取刘海屏的安全区域 -->
		<view class="tabBar" :style="{height: is_lhp ? '150rpx' : '108rpx'}">
			<view class="tabBar_list" :style="{paddingBottom:is_lhp?'40rpx':''}">
				<view v-for="(item) in tab_nav_list" :key="item.id" class="tabBar_item" @tap="cut_index(item.id)">
					<image v-if="show_index == item.id" :src="`../../static/tabBar/${item.id+1}${item.id+1}.png`">
					</image>
					<image v-else :src="`../../static/tabBar/${item.id+1}.png`" class="rotate-end"></image>
					<view :class="{'tabBar_name':true,'nav_active':show_index == item.id}">{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入SDK核心类，js文件根据自己业务，位置可自行放置
	let QQMapWX = require('../../utils/map/qqmap-wx-jssdk.js');
	let qqmapsdk;
	//! 页面组件
	import category from "@/pages/category/category.vue";
	import cart from "@/pages/cart/cart.vue"
	import user from "@/pages/user/user.vue";
	//!网络请求
	import userApi from "../../network/user/userApi.js";
	export default {
		components: {
			category,
			cart,
			user
		},
		data() {
			return {
				//! 记录用户的地理位置
				location: null,
				//! 地理位置的名称
				locName: null,
				show_index: 0, // 控制显示那个组件
				tab_nav_list: [{
					'id': 0,
					'name': '物资分类'
				}, {
					'id': 1,
					'name': '物资清单'
				}, {
					'id': 2,
					'name': '个人中心'
				}], //菜单列表
				is_lhp: false,
			}
		},
		onLoad(options) {
			let userInfo = uni.getStorageSync('wxuser')
			if (!userInfo || userInfo?.active != 2) {
				return uni.reLaunch({
					url: "../login/login"
				})
			}
			setInterval(async () => {
				let userInfo = uni.getStorageSync('wxuser')
				if (userInfo && userInfo.active == 2) {
					let resData = await userApi.detail({ id: userInfo.id })
					uni.setStorageSync('wxuser', resData.data)
					getApp().globalData.wxuser = resData.data
					if (resData.data.active != 2) {
						return uni.reLaunch({
							url: "../login/login"
						})
					}
				}
			}, 1000)
			//！获取用户的地理位置
			let _this = this
			this.is_lhp = this.$is_bang
			// 实例化API核心类
			qqmapsdk = new QQMapWX({
				key: getApp().globalData.tx_map_key
			});


			//! 显示过渡页面
			setTimeout(() => {
				uni.setNavigationBarColor({
					backgroundColor: '#fddf2f',
					frontColor: '#000000',
					success: () => {
						wx.setNavigationBarTitle({
							title: userInfo?.active == 2 ? '百勤建设' : '用户登陆'
						})
						//！ 获取用户地理位置
						_this.userLocation();
					},
					fail(err) {
						console.log(err)
					}
				})
			}, 500)

			//! 视图渲染完才调用
			this.$nextTick(function() {
				// 一定要等视图更新完再调用方法   -----------++++++++++++++++重要
				setTimeout(function() {
					_this.$refs.category.ontrueGetList() //初次加载第一个页面的请求数据
				}, 100)
			})
		},
		onShow() {
			const page = getCurrentPages();
			//! 获取传递过来的参数值
			const currentPage = page[page.length - 1];
			if (currentPage.location) {
				this.locName = currentPage.location;
			}
			if (this.show_index == 1) this.$refs.cart.ontrueGetList()
		},
		methods: {
			//! 判断用户是否授权获取地理位置
			userLocation() {
				const _this = this;
				uni.getSetting({
					success: (res) => {
						// res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
						// res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
						// res.authSetting['scope.userLocation'] == true    表示 地理位置授权
						if (res.authSetting['scope.userLocation'] != undefined && res.authSetting[
								'scope.userLocation'] != true) {
							//未授权
							uni.showModal({
								title: '请求授权当前位置',
								content: '需要获取您的地理位置，请确认授权',
								success: function(res) {
									if (res.cancel) {
										//取消授权
										wx.showToast({
											title: '拒绝授权',
											icon: 'none',
											duration: 2000
										})
									} else if (res.confirm) {
										//确定授权，通过wx.openSetting发起授权请求
										uni.openSetting({
											success: function(res) {
												if (res.authSetting[
														"scope.userLocation"] ==
													true) {
													wx.showToast({
														title: '授权成功',
														icon: 'none',
														duration: 2000
													})
													//再次授权，调用wx.getLocation的API
													_this.goAddress();
												} else {
													wx.showToast({
														title: '授权失败',
														icon: 'none',
														duration: 2000
													})
													//! 用户拒绝地理位置则显示获取失败
													_this.locName = "获取失败";
												}
											}
										})
									}
								}
							})
						} else if (res.authSetting['scope.userLocation'] == undefined) {
							//用户首次进入页面,调用wx.getLocation的API
							_this.goAddress();
						} else {
							//调用wx.getLocation的API
							_this.goAddress();
						}
					}
				})
			},

			//! 获取用户经纬度并解析出地址
			goAddress() {
				const _this = this;
				uni.getLocation({
					type: 'wgs84',
					success(res) {
						//根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析,前面已引入SDK
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success: function(addressRes) {
								_this.location = addressRes.result.ad_info;
								_this.locName = addressRes.result.ad_info.city;
							}
						})
					},
					fail: function(err) {
						//! 说明用户拒绝了首次的获取地理位置
						_this.locName = "获取失败";
					}
				})
			},
			// 切换组件
			cut_index(type) {
				let _this = this
				_this.show_index = type
				if (_this.show_index == 0) {
					_this.$refs.category.ontrueGetList()
				} else if (_this.show_index == 1) {
					_this.$refs.cart.ontrueGetList()
				} else if (_this.show_index == 2) {
					_this.$refs.user.ontrueGetList()
				}
			},
			onPullDownRefresh() {
				if (this.show_index > 1) return uni.stopPullDownRefresh();
				setTimeout(() => {
					if (this.show_index == 0) this.$refs.category.ontrueGetList()
					if (this.show_index == 1) this.$refs.cart.ontrueGetList()
					uni.stopPullDownRefresh();
				}, 1000);
				// console.log('下拉刷新四个组件公用的下拉刷新方法,根据在哪个页面下拉执行哪个页面的刷新方方法即可')
				// console.log('如果想要自定义刷新的话，插件市场就有一个   非常好用也非常容易入手')
			},
			//! 用户登录
			async login() {
				let that = this
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
						console.log(res)
						let query = {
							code: code,
							userHead: res.userInfo.avatarUrl,
							userName: res.userInfo.nickName,
							userGender: res.userInfo.gender, // 0:未知,1:男,2:女
							userCity: res.userInfo.city,
							userProvince: res.userInfo.province
						}
						let resData = await userApi.login(query)
						console.log("登录结果", resData)
						//! 存储到全局
						uni.setStorageSync('wxuser', resData.data)
						getApp().globalData.wxuser = resData.data
					},
					complete: () => {
						console.log("完成获取")
					}
				})
			},
		},
		onShareAppMessage(options) {
			if (options.from === "button") {
				return {
					title: `百勤建设`,
					path: '/pages/index/index',
					imageUrl: 'https://www.szrdrp.com/dl/img/e294454034a9f8f7073183c74ef8d0c0cdef8107.jpeg@600w_338h.jpeg'
				}
			}
			return {
				title: `百勤建设`,
				path: '/pages/index/index',
				imageUrl: 'https://www.szrdrp.com/dl/img/e294454034a9f8f7073183c74ef8d0c0cdef8107.jpeg@600w_338h.jpeg'
			}
		}
	}
</script>

<style lang="scss">
	.tabBar {
		width: 100%;
		height: 98rpx;
		background: #fff;
		border-top: 1px solid #E5E5E5;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;

		.tabBar_list {
			width: 86%;
			display: flex;
			justify-content: space-around;

			image {
				width: 60rpx;
				height: 60rpx;
				margin-bottom: 2rpx
			}

			.tabBar_item {
				width: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 20rpx;
				color: #969BA3;
			}

		}
	}

	.nav_active {
		color: $black_color;
	}

	.rotate-end {
		opacity: 1;
	}
</style>
