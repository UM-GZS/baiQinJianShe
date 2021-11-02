<template>
	<view class="home_wrap">
		<!-- 置顶在上方的按钮 -->
		<head-search class="header_search" :location="locName" @clickLoc="clickLoc" ref="hh"></head-search>
		<view class="header">
			<!-- 背景轮播图 -->
			<u-swiper height="380" :list="bannerList"></u-swiper>
			<!-- 定位在下方的工具栏 -->
			<view class="service_wrap">
				<view class="service_list">
					<view class="service_item" v-for="(item,index) in  serviceList" @click="serviceClick(item.id)"
						:key="item.id">
						<image :src="item.icon" class="s_icon"></image>
						<view class="desc">{{ item.title }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 热点推送 -->
		<hot-info @userLogin="hasLogin"></hot-info>
		<!-- 招聘信息 -->
		<recruit-info></recruit-info>
		<!-- 商品特惠 -->
		<discount-info></discount-info>
	</view>
</template>

<script>
	//! 网络请求
	import homeApi from "../../network/home/homeApi.js";
	//! 用户接口
	import userApi from "../../network/user/userApi.js";
	//! 组件
	import headSearch from "../../components/head-search/head-search.vue";
	import hotInfo from "./childCmps/hot-info.vue";
	import recruitInfo from "./childCmps/recruit_info.vue";
	import discountInfo from "./childCmps/discount_info.vue";
	export default {
		components: {
			headSearch,
			hotInfo,
			recruitInfo,
			discountInfo
		},
		props: {
			locName: {
				type: String,
				default: '正在获取'
			},
		},
		data() {
			return {
				//! 是否重新请求判断
				flag: false,
				//! 服务列表
				serviceList: [{
						id: 1,
						title: '车辆买卖',
						icon: '../../static/index/vehicle_trading.png'
					},
					{
						id: 2,
						title: '设备维修',
						icon: '../../static/index/repair.png'
					},
					{
						id: 3,
						title: '旧机置换',
						icon: '../../static/index/substitution.png'
					},
					{
						id: 4,
						title: '求职招聘',
						icon: '../../static/index/recruit.png'
					}
				],
				//! 轮播图的数据
				bannerList: [],
			}
		},
		//! 实例化组件
		created() {

		},
		watch: {
			locName: {
				handler(newValue, oldValue) {},
				immediate: true,
				deep: true
			}
		},
		methods: {
			//! 组件的网络请求
			ontrueGetList() {
				if (!this.flag) {
					this.getBannerList();
					this.flag = true;
				}
			},
			//! 获取首页轮播图
			async getBannerList() {
				let queryInfo = {
					sort: 'id desc'
				}
				let arr = [];
				const {
					data
				} = await homeApi.bannerList(queryInfo);
				for (let item of data.list) {
					//! 拼接地址
					arr.push({
						...item,
						image: getApp().globalData.requesturl + item.img_url
					});
				}
				//! 存储数据
				this.bannerList = arr;
			},
			//! 子组件向父组件传递选择地理位置的事件
			clickLoc() {
				// uni.navigateTo({
				// 	url: "../../subPackages/home/location"
				// })
			},
			//! 子组件传递给父组件完成用户登录
			hasLogin() {
				// 调用登录方法
				this.login();
			},
			//! 切换对应的页面
			serviceClick(id) {
				//! 根据id对应跳转界面
				switch (id) {
					case 1:
						if (!getApp().globalData.wxuser) {
							this.login()
							return;
						}
						uni.navigateTo({
							url: "../../subPackages/vehicleBuy/vehicleBuy"
						});
						break;
					case 2:
						//! 设备维修 判断用户是否完成登录
						if (!getApp().globalData.wxuser) {
							this.login()
							return;
						}
						uni.navigateTo({
							url: "../../subPackages/home/repair"
						})

						break;
					case 3:
						if (!getApp().globalData.wxuser) {
							this.login()
							return;
						}
						uni.navigateTo({
							url: "../../subPackages/oldMachine/oldMachineIndex"
						})
						break;
					case 4:
						if (!getApp().globalData.wxuser) {
							this.login();
							return;
						}
						uni.navigateTo({
							url: "../../subPackages/recruitment/recruitmentIndex"
						})
						break;
				}
			},
			//! 用户登录
			async login() {
				let that = this
				// let wxuser = uni.getStorageSync('wxuser')
				// if (wxuser.phone) {
				// 	return
				// }
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
				}) //getUserProfile end
			},
		}
	}
</script>

<style lang="scss" scoped>
	.home_wrap {
		width: 100%;
		height: 100%;
		padding-bottom: 110rpx;
		position: relative;
		background: #F2F2F2;

		//! 头部内容
		.header {
			width: 100%;
			position: relative;
			//! 头部搜索

			.service_wrap {
				position: absolute;
				box-sizing: border-box;
				left: 0;
				bottom: -165rpx;
				z-index: 100;
				width: 100%;
				padding: 0 30rpx;
				// height: 170rpx;

				.service_list {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: flex-start;
					padding-top: 40rpx;
					padding-bottom: 33rpx;
					align-content: center;
					border-radius: 20rpx;
					background-color: #ffffff;

					.service_item {
						width: 25%;
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						.desc {
							margin-top: 20rpx;
							font-weight: 700;
							font-size: 25rpx;
							color: #000000;
						}

						.s_icon {
							width: 67.5rpx;
							height: 67.5rpx;
						}
					}
				}
			}
		}

	}
</style>
