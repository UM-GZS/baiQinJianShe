<template>
	<!-- 搜索界面 -->
	<view class="search_wrap">
		<u-sticky>
			<!-- 只能有一个根元素 -->
			<view class="header_search">
				<u-search @change="change" @search="search" @custom="search" placeholder="输入您想要的商品" v-model="queryInfo.keyword"></u-search>
			</view>
		</u-sticky>
		<!-- 显示内容 -->
		<view class="content">
			<!-- 内容为空时显示历史搜索 -->
			<view class="history" v-if="!showEmpty && !list.length">
				<view class="title">
					<text>历史搜索</text>
					<image @click="delHistory" src="../../static/index/del.png" style="width: 35rpx;height: 35rpx;"></image>
				</view>
				<!-- 搜索记录列表 -->
				<view class="history_list">
					<view class="his_item" v-for="(item,index) in historyList" :key="index" @click="historyClick(item.name)">
						{{ item.name }}
					</view>
				</view>
			</view>
			<!-- 显示的商品列表 -->
			<view class="goods_content" v-else>
				<view class="goodsList" v-if="list.length > 0">
					<view class="item" @click="detail(item.id)" v-for="(item,index) in list" :key="index">
						<view class="left_img">
							<image :src="url + item.small_img_urls" style="width: 100%;height: 100%;border-radius: 15rpx;"></image>
						</view>
						<!--  右边内容 -->
						<view class="right_info">
							<view class="title">{{ item.name }}</view>
							<!-- <view class="sales">
								<text>已售</text>
								<text>{{ item.sales }}</text>
								<text>/</text>
								<text>剩余</text>
								<text>{{ item.inventory }}</text>
							</view> -->
							<view class="other">
								<view class="price">
									<text>￥</text>
									<text style="font-size: 40rpx;">{{ item.price }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 没有内容显示 -->
				<view class="empty" v-if="showEmpty">
					<u-empty text="抱歉,未找到符合条件的商品" mode="list"></u-empty>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import categoryApi from "../../network/category/category.js";
	import userApi from "../../network/user/userApi.js";
	export default {
			data() {
				return {
					url:getApp().globalData.requesturl,
					// 记录用户的userid
					userId:'',
					queryInfo:{
						page_num:1,
						page_size:5,
						//! 搜索的关键字
						keyword: '',
						user_id:'', // 用户id用于天机搜索记录，搜索商品时添加用户id
						sort:'sales desc' // 根据销量从高到低
					},
					showEmpty:false,
					//!判断是否还有更多数
					hasMore:true, //!判断是否还有更多数据
					//! 搜索的内容数据
					list:[],
					// 本地的搜索记录
					historyList:[]
				}
			},
			onLoad(options) {
				// 判断用户是否登录
				let wxuser = getApp().globalData.wxuser;
				if(wxuser) {
					this.queryInfo.user_id = wxuser.id;
					this.userId = wxuser.id;
					this.getUserHistory();
				}
				if (options.searchData) {
					this.queryInfo.keyword = options.searchData;
					this.search();
				}
			 // let his = uni.getStorageSync("history");
			 // if(his) {
				//  this.historyList = his;
			 // }
			},
			methods: {
				// 用户点击搜索请求获取数据
			 async search() {
				 //!判断内容是否为空
				 if(!this.queryInfo.keyword.trim()) {
					 return getApp().globalData.global_Toast(true,"请输入搜索内容",function(res){})
				 }
					const res = await categoryApi.goodsList(this.queryInfo);
					if(this.queryInfo.page_num * this.queryInfo.page_size >= res.data.total) {
						this.hasMore = false;
					}
					if(!res.data.list.length) {
						this.showEmpty = true
					}
					this.list  = [...this.list,...res.data.list];
				},
				// 获取用户的搜索记录
				async getUserHistory() {
					let  queryInfo = {
						user_id:this.userId,
						page_num:1,
						page_size:20,
						sort:'id desc'
					}
					const res = await userApi.searchHistory(queryInfo);
					this.historyList = res.data.list;
				},
				// 搜索内容监听
				change(value) {
					if(!value) {
						this.clearData();
					}else {
						this.queryInfo.keyword = value;
					}
				},
				clearData() {
					this.queryInfo = {
						page_num:1,
						page_size:5,
						//! 搜索的关键字
						keyword: '',
						user_id:this.userId,
						sort:'sales desc' // 根据销量从高到低
					},
					//! 搜索的内容数据
					this.list = [];
					this.hasMore = true;
					this.showEmpty = false;
				},
				// 删除搜索记录
				delHistory() {
					this.historyList = [];
					uni.removeStorageSync("history")
				},
				historyClick(value) {
					//! 搜索记录发送请求
					this.queryInfo.keyword = value;
					this.search();
				},
				// 跳转详情
				detail(id) {
					uni.navigateTo({
						url:`../category/category_detail?order_types=2&id=${id}`
					})
				},
			},
			// 页面销毁时写入历史记录到缓存中
			destroyed() {
				uni.setStorageSync("history",this.historyList);
			},
			//!页面到底触发
			onReachBottom(){
				if(this.hasMore) {
					//追加数
					this.queryInfo.page_num ++;
					this.search();
				}
			}
	}
</script>

<style lang="scss" scoped>
	.search_wrap {
		width: 100%;
		height:100%;
		.header_search{
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 20rpx;
			background-color: #ffffff;
		}
		.content {
			width: 100%;
			.history {
				width: 100%;
				height: calc(100vh - 100rpx);
				background-color: #ffffff;
				.title {
					width: 100%;
					padding:20rpx;
					// margin-top: 20rpx;
					@include flex-jcsb;
				}
				.history_list {
					width: 100%;
					display: flex;
					padding: 0 20rpx;
					flex-wrap: wrap;
					.his_item {
						padding: 15rpx 30rpx;
						border-radius: 40rpx;
						font-size: 20rpx;
						margin-right: 20rpx;
						color: #828282;
						background-color: #f2f2f2;
						margin-top: 20rpx;
					}
				}
			}
			.goods_content {
				width: 100%;
				background-color: #ffffff;
				.goodsList {
					width: 100%;
					padding: 0 20rpx;
					.item {
						width: 100%;
						display: flex;
						padding: 30rpx 20rpx;
						border-bottom: 1rpx solid $bk_color;
						.left_img {
							width: 300rpx;
							height: 250rpx;
						}
						.right_info {
							position: relative;
							margin-left: 20rpx;
							flex: 1;
							display: flex;
							flex-direction: column;
							.title {
								font-size: 35rpx;
								font-weight: 600;
								@include clamp2;
							}
							.sales {
								margin: 25rpx 0;
								color: #03bb22;
							}
							.other {
								margin-top: 50rpx;
								font-weight: 800;
								color: red;
							}
						}
					}
				}
				.empty {
					//!没有内容的时候显示
					width: 100%;
					height: calc(100vh -  100rpx);
					@include flex-center;
				}
			}
		}
	}
</style>
