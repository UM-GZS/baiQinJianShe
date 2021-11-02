<template>
	<view class="info_wrap">
		<!-- 头部搜索框 -->
		<!-- <head-search :location="locName"></head-search> -->
		<!-- 切换按钮 -->
		<view class="swiper_tab">
			<view class="tab_item" @click="changeTab(item.id,index)" v-for="(item,index) in tabList" :key="index">
				<image style="width: 40rpx;height: 40rpx;" :src="current === index ? item.activeImg : item.img" ></image>
				<text style="margin-left: 10rpx;" :style="current === index ? 'color:black':'color:$gray_color'">{{ item.title }}</text>
			</view>
		</view>

		<!-- 内容区域 -->
		<swiper @change="change" :current="current" class="swiper_content" enable-flex>
			<swiper-item v-for="(item,index) in tabList" :key="index" class="swiperItem">
				<!-- 每一项内容区域 -->
				<scroll-view @scrolltolower="lower" style="width: 100%;height: 100%;" scroll-y enable-flex>
					<view class="info_item" @click="infoDetail(item)" v-for="(item,index) in list" :key="index">
						<view class="info_title">
							{{ item.name }}
						</view>
						<!-- 图片以及文字内容 -->
						<view class="info_content">
							<view class="left_pic">
								<image style="width: 100%;height: 100%;" :src="url + item.small_img_urls">
								</image>
							</view>
							<view class="right_msg">
								<view class="desc" v-html="item.info"></view>
								<!-- 用户信息 -->
								<view class="user_info">
									<view class="name common">
										<image style="width: 30rpx;height: 30rpx;" :src="url + item.user_url">
										</image>
										<text style="margin-left: 15rpx;">{{ item.user_name }}</text>
									</view>
									<view class="time" style="color: #B3B3B3;font-size: 23rpx;">
										{{ item.create_time | filterDate }}
									</view>
								</view>
								<!-- 收藏以及分享 -->
								<view class="edit">
									<!-- 收藏 -->
									<view class="collect common" @click.stop="collect(item,index)">
										<image src="../../static/information/collect.png" v-if="item.isCollect" style="width: 28rpx;height: 29rpx;">
										</image>
										<image src="../../static/uview/common/collect.png" v-else style="width: 28rpx;height: 29rpx;">
										</image>
										<text style="margin-left: 16.5rpx;font-size: 27rpx;">收藏</text>
									</view>
									<!-- 分享 -->
									<button open-type="share" class="share common" style="margin-left: 30rpx;" @click.stop="share(item)">
										<image src="../../static/information/share.png" style="width: 25rpx;height: 27.5rpx;">
										</image>
										<text style="margin-left: 16.5rpx;font-size: 27rpx;">分享</text>
									</button>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import articleApi from "../../network/article/article.js";
	import collectApi from "../../network/user/collect.js";
	import headSearch from "@/components/head-search/head-search.vue";
	import userApi from '../../network/user/userApi.js';
	export default {
		components: {
			headSearch
		},
		props: {
			locName: {
				type: String,
				default: '正在获取'
			},
		},
		data() {
			return {
				url:getApp().globalData.requesturl,
				flag:false,
				queryInfo:{
					page_num:1,
					page_size:20,
					sort:'id desc'
				},
				total:0,
				//! 判断是否还有更多数据
				hasMore:true,
				//! 用户收藏的列表数据
				userCollect:[],
				//! 数据切换标题数据
				tabList:[
					{id:1,title:'热点推送',img:'../../static/information/hotInfo.png',activeImg:'../../static/information/hotInfo_active.png'},
					{id:2,title:'行业动态',img:'../../static/information/industry.png',activeImg:'../../static/information/industry_active.png'}
				],
				current: 0, //! 默认选中的swiper下标
				//! 显示的列表
				list: []
			}
		},
		filters: {
			filterDate: function(value) {
				return getApp().globalData.formatDate1(value);
			}
		},
		methods: {
			//! 用于当前组件的网络请求函数
			ontrueGetList() {
				//!先清除数据重新请求
				this.clearData();
				this.getArticle();
			},
			//! 获取文章列表
			async getArticle() {
				const res = await articleApi.articleList(this.queryInfo);
				this.total = res.data.total;
				if(this.queryInfo.page_num * this.queryInfo.page_size >= this.total) {
					this.hasMore = false;
				}
				for(let i = 0; i < res.data.list.length;i++) {
					res.data.list[i].isCollect = false;
				}
				this.list = [...this.list,...res.data.list];
				//! 获取用户收藏
				this.getUserCollect();
			},
			//! 获取用户的所有收藏列表
			async getUserCollect() {
				if(getApp().globalData.wxuser) {
					let params = {
						user_id:getApp().globalData.wxuser.id,
						collection_status:0,
						page_num:1,
						page_size:999
					}
					const res = await collectApi.getCollect(params);
					this.userCollect = res.data.list;
					//! 遍历数据判断是否有对应的收藏数据
					for(let i = 0;i < this.userCollect.length; i++) {
						for(let j = 0;j < this.list.length;j++) {
							if(this.userCollect[i].collection_id === this.list[j].id) {
								this.list[j].isCollect = true;
								continue
							}
						}
					}
				}
			},
			// 跳转详情页面
			infoDetail(item) {
				//! 判断用户是否已经登录
				if(!getApp().globalData.wxuser) {
					this.login();
					return ;
				}
				uni.navigateTo({
					url:`../../subPackages/information/informationDetail?id=${item.id}`
				})
			},
 			//! 点击收藏按钮
			collect(item,index) {
				//! 判断用户是否登录
				if(!getApp().globalData.wxuser) {
					this.login();//! 调用登录接口
					return ;
				}
				//! 判断当前数据是否收藏
				if(item.isCollect) {
					// 用当前商品id去匹配对应的用户收藏id
					let idIndex = this.userCollect.findIndex(v => {
						return v.collection_id === item.id
					})
					//! 发送取消收藏的网络请求
					let params = {
						id:this.userCollect[idIndex].id
					}
					collectApi.deleteCollect(params).then(res => {
						///! 隐藏收藏显示
						this.list[index].isCollect = false;
						getApp().globalData.global_Toast(true,"文章取消收藏",function(res) {})
					})
				}else {
					let params = {
						user_id:getApp().globalData.wxuser.id, // 用户id
						collection_id:item.id, // 收藏的文章id
						collection_status:0
					}
					//! 发送收藏的网络请求
					collectApi.addCollect(params).then(res => {
						this.list[index].isCollect = true;
						//! 重新获取对应的用户收藏
						this.getUserCollect();
						getApp().globalData.global_Toast(true,"文章已收藏",function(res) {})
					})
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
						console.log("登录结果",resData)
						//! 存储到全局
						uni.setStorageSync('wxuser', resData.data)
						getApp().globalData.wxuser = resData.data
					},
					complete:() => {
						console.log("完成获取")
					}
				}) //getUserProfile end
			},
			//! 点击分享按钮
			share() {
				let data = {
					msg:'旋挖宝资讯'
				}
				uni.setStorageSync("shareInfo",data);
				uni.showShareMenu({
				  withShareTicket: true,
				  menus: ['shareAppMessage', 'shareTimeline'],
					success(res) {
					},
					fail(err) {
					}
				})
			},
			//! 按钮点击的切换
			changeTab(id,index) {
				this.current = index;
			},
			//! 滑动页面的切换
			change(e) {
				console.log("滑动",e)
				this.current = e.target.current;
			},
			//! 数据滚动到底部的监听
			lower() {
				if(this.hasMore) {
					this.getArticle();
				}else {
					getApp().globalData.global_Toast(true,"没有更多数据了",function(res){})
				}
			},
			//!清除默认数据重新请求
			clearData() {
				this.queryInfo = {
					page_num:1,
					page_size:20,
					sort:'id desc'
				}
				this.userCollect = [];
				this.list = [];
			}
		},	
		
	}
</script>

<style lang="scss">
	.info_wrap {
		width: 100%;
		height: 100%;
		padding-bottom: 100rpx;
		background: #F2F2F2;

		.swiper_tab {
			// margin-top: 10rpx;
			width: 100%;
			height: 90rpx;
			background-color: #ffffff;
			display: flex;
			.tab_item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: 600;
				font-size: 30rpx;
				color: $gray_color;
			}
		}

		//! 内容区域
		.swiper_content {
			width: 100%;
			margin-top: 30rpx;
			height: calc(100vh - 218rpx);
			overflow-y: scroll;
			box-sizing: border-box;
			
			// 设置swiperItem的间距
			.swiperItem {
				width: 100%;
				box-sizing: border-box;
				padding: 0 20rpx;
			}
			
			.info_item {
				width: 100%;
				display: flex;
				flex-direction: column;
				background-color: #ffffff;
				border-radius: 15rpx;
				padding: 32rpx 32rpx 5rpx 32rpx;
				margin-bottom: 10rpx;

				.info_title {
					width: 100%;
					padding-left: 8rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					font-size: 32rpx;
					color: #38393B;
					font-weight: 800;
					overflow: hidden;
				}

				//! 图片以及文字内容
				.info_content {
					width: 100%;
					margin: 20rpx 0;
					display: flex;
					align-items: center;

					.left_pic {
						align-self: flex-start;
						width: 188.5rpx;
						height: 188.5rpx;
						border: 1rpx solid #bbbbbb;
					}

					.right_msg {
						flex: 1;
						margin-left: 10rpx;
						display: flex;
						flex-direction: column;

						.desc {
							width: 100%;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							font-size: 26rpx;
							color: #808080;
							overflow: hidden;
						}
						.share {
							margin: 0;
							padding: 0;
							background: transparent;
							// font-size: 25rpx;
							color: $gray_color;
							&::after{
								border: none;
							}
						}
						//! 公共样式
						.common {
							display: flex;
							font-size: 28rpx;
							align-items: center;
						}

						.user_info {
							margin: 20rpx 0;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: $gray_color;
						}

						//! 操作
						.edit {
							width: 100%;
							display: flex;
							color: #B3B3B3;
							font-size: 35rpx;
							justify-content: flex-end;
							align-items: center;
						}
					}
				}
			}
		}
	}
</style>
