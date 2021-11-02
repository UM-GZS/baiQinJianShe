<template>
	<view class="info_wrap">
		<!-- 切换按钮 -->
		<view class="swiper_tab">
			<view class="tab_item" @click="changeTab(item.id,index)" v-for="(item,index) in tabList" :key="index">
				<text style="margin-left: 10rpx;"
					:style="current === index ? 'color:black':'color:$gray_color'">{{ item.title }}</text>
			</view>
		</view>

		<!-- 内容区域 -->
		<swiper @change="change" :current="current" class="swiper_content" style="padding-bottom: 25rpx;" enable-flex>
			<swiper-item v-for="(swiperItem,swiperIndex) in tabList" :key="swiperIndex" class="swiper_wrap">
				<!-- 文章 -->
				<scroll-view @scrolltolower="lower" scroll-y v-if="swiperIndex==0" enable-flex
					style="width: 100%;height: 100%;padding-bottom:10rpx;">
					<view v-if="textList.length>0">
						<view class="info_item" v-for="(item,index) in textList" :key="index"
							@click="goDetail(item.id)">

							<view class="info_content">
								<view class="title">
									<view>{{ item.name }}</view>
								</view>
								<view class="subTitle">
									<view>{{ item.info1 }} {{ item.info2 }}{{ item.info3 }}</view>
								</view>
								<view class="bottom">
									<view class="icon">
										<u-image width="40rpx" height="40rpx" class="img"
											:src="baseUrl + item.user_url"></u-image>
										<text>{{ item.user_name }}</text>
									</view>
									<view>
										{{ item.create_time | filterDate }}
									</view>
								</view>

							</view>

						</view>
					</view>
					<nonedata v-else :text="`列表为空`"></nonedata>
				</scroll-view>

				<!-- 商品 -->
				<scroll-view @scrolltolower="lower" scroll-y v-if="swiperIndex==1" enable-flex 
					style="width: 100%;height: 100%;padding-bottom:10rpx;">

					<view v-if="goodsList.length>0">
						<view class="goods_list">
							<view class="item" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item.id)">
								<view class="left_cover">
									<image :src="baseUrl + item.small_img_urls"></image>
								</view>
								<view class="right_info">
									<view class="name">{{ item.name }}</view>
									<view class="subtitle">{{ item.name }}</view>
									<!-- <view class="price">
										<view>直营车辆</view>
										<view>分期</view>
									</view> -->
									<view class="info">￥{{ item.price }}</view>
								</view>
							</view>
						</view>
					</view>

					<nonedata v-else :text="`列表为空`"></nonedata>

				</scroll-view>

				<!-- 招聘 -->
				<scroll-view @scrolltolower="lower" scroll-y v-if="swiperIndex==2" enable-flex
					style="width: 100%;height: 100%;padding-bottom:10rpx;">
					<view class="zhaopin_list" v-if="recruitmentList.length>0">
						<view class="item" v-for="item in recruitmentList" :key="item.id">
							<view class="left_cover">
								<image :src="item.cover"></image>
							</view>
							<view class="right_info">
								<view class="name">{{item.name}}</view>
								<view class="subtitle">{{item.company}}公司 {{item.num}} 人</view>
								<view class="price">{{item.price}}</view>
								<view class="info">{{item.address}} | {{item.year}} | {{item.limit}}</view>
							</view>
						</view>
					</view>
					<nonedata v-else :text="`列表为空2`"></nonedata>
				</scroll-view>
			</swiper-item>

		</swiper>


	</view>
</template>

<script>
	import API from "../../network/secondHand/secondHand"
	import collectApi from "../../network/user/collect.js";
	import articleApi from "../../network/article/article.js";
	import categoryApi from "../../network/category/category.js";
	import nonedata from "../../components/none-data/none-data"
	export default {
		components: {
			nonedata
		},
		data() {
			return {
				//! 数据切换标题数据
				tabList: [{
						id: 1,
						title: '文章',
					},
					{
						id: 2,
						title: '商品',
					},
					{
						id: 3,
						title: '招聘',
					}
				],
				// 文章的请求列表
				textQueryInfo: {
					user_id: getApp().globalData.wxuser.id,
					collection_status: 0, // 文章
					page_num: 1,
					page_size: 999, //! 坑 默认请求最大数据量
					sort: 'id desc'
				},
				// 商品请求列表
				goodsInfo: {
					user_id: getApp().globalData.wxuser.id,
					collection_status: 1, // 商品
					page_num: 1,
					page_size: 999,
					sort: 'id desc'
				},
				current: 0, //! 默认选中的swiper下标
				baseUrl: "",
				textList: [], // 文章列表数据
				goodsList: [], // 商品列表数据
				recruitmentList: [], // 招聘数据
			}
		},
		watch: {
			current() {
				//! 每次切换清除默认数据从新加载
				this.clearData();
				this.getList();
			}
		},
		onLoad() {
			this.getList()
			this.baseUrl = getApp().globalData.requesturl
		},
		filters: {
			filterDate: function(value) {
				return getApp().globalData.formatDate1(value);
			}
		},
		methods: {
			getList() {
				let index = this.current
				switch (index) {
					case 0:
						this.getTextList()
						break;
					case 1:
						this.getGoodsList()
						break;
					case 2:
						this.getRecruitmentList()
						break;

					default:
						this.getTextList()
						break;
				}
			},
			// 请求文章列表
			async getTextList() {
				const res = await collectApi.getCollect(this.textQueryInfo);
				let list = res.data.list;
				//根据拿到的数据遍历请求
				for (let i = 0; i < list.length; i++) {
					const articleRes = await articleApi.articleDetail({
						id: list[i].collection_id
					});
					this.textList.push(articleRes.data);
				}
			},
			// 获取商品的函数
			async getGoodsList() {
				const res = await collectApi.getCollect(this.goodsInfo);
				// this.goodsList = list
				let list = res.data.list;
				for (let i = 0; i < list.length; i++) {
					let params = {
						id: list[i].collection_id
					}
					const goodsRes = await categoryApi.goodsDetail(params);
					if(goodsRes.data) {
						this.goodsList.push(goodsRes.data)
					}
				}
			},
			//! 获取求职招聘
			getRecruitmentList() {
				let list = [{
						id: 1,
						cover: "../../static/index/sw1.jpg",
						name: '挖机司机',
						company: "jshfk",
						num: 99,
						price: "15-20k",
						address: "北京",
						year: "1年",
						limit: "学历不限"
					},
					{
						id: 2,
						cover: "../../static/index/sw1.jpg",
						name: '挖机司机',
						company: "jshfk",
						num: 99,
						price: "15-20k",
						address: "北京",
						year: "1年",
						limit: "学历不限"
					},
					{
						id: 3,
						cover: "../../static/index/sw1.jpg",
						name: '挖机司机',
						company: "jshfk",
						num: 99,
						price: "15-20k",
						address: "北京",
						year: "1年",
						limit: "学历不限"
					},
				]
				this.recruitmentList = list
			},
			//! 按钮点击的切换
			changeTab(id, index) {
				this.current = index;
			},
			//! 滑动页面的切换
			change(e) {
				this.current = e.target.current;
			},
			//! 数据滚动到底部的监听
			lower() {},
			//! 清除默认数据
			clearData() {
				this.textQueryInfo = {
					user_id: getApp().globalData.wxuser.id,
					collection_status: 0, // 文章
					page_num: 1,
					page_size: 999,
					sort: 'id desc'
				}
				this.goodsInfo = {
					user_id: getApp().globalData.wxuser.id,
					collection_status: 1, // 商品
					page_num: 1,
					page_size: 999,
					sort: 'id desc'
				}
				this.textList = [] // 文章列表数据
				this.goodsList = [] // 商品列表数据
				this.recruitmentList = [] // 招聘数据
			},
			goSecondHand() {
				//! 判断用户是否已经完成登录
				if (!getApp().globalData.wxuser) {
					getApp().globalData.global_Toast(true, "请先完成登录", function(res) {});
					setTimeout(() => {
						uni.redirectTo({
							url: "../../pages/index/index"
						})
					}, 2500)
					return;
				} else {
					uni.navigateTo({
						url: "../vehicleBuy/secondHand"
					})
				}
			},
			goDetail(id) {
				console.log(id);
				uni.navigateTo({
					url:`../information/informationDetail?id=${id}`
				})
			},
			goGoodsDetail(id) {
				uni.navigateTo({
					url:`../category/category_detail?order_types=2&id=${id}`
				})
			} 
		},

	}
</script>

<style lang="scss">
	.info_wrap {
		width: 100%;
		height: 100%;
		padding-bottom: 100rpx;
		overflow-y: hidden;

		.swiper_tab {
			margin-top: 10rpx;
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
			height: 100%;
			overflow-y: scroll;
			padding: 0 20rpx 0 20rpx;
			box-sizing: border-box;

			.info_item {
				width: 100%;
				display: flex;
				background-color: #ffffff;
				border-radius: 15rpx;
				padding: 0 30rpx;
				margin-bottom: 10rpx;

				.info_content {
					width: 100%;
					margin: 20rpx 0;
					display: flex;
					flex-direction: column;

					.header {
						font-size: 34rpx;
						font-weight: 600;
						color: #000;
						width: 100%;
						display: -webkit-box;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.subTitle {
						font-size: 28rpx;
						color: #808080;
						display: -webkit-box;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						margin-top: 20rpx;
					}

					.bottom {
						margin: 30rpx 0 10rpx 0;
						@include flex-jcsb;
						color: #B3B3B3;

						.icon {
							@include flex-center;

							.img {
								border-radius: 50%;
								overflow: hidden;
								margin-right: 20rpx;
							}
						}
					}


				}


			}

			.goods_list {
				padding: 22rpx;
				background-color: #fff;

				.item {
					display: flex;
					margin-bottom: 30rpx;

					.left_cover {
						width: 240rpx;
						@include flex-center;
						padding: 10rpx 0;

						image {
							width: 230rpx;
							height: 230rpx;
						}
					}

					.right_info {
						flex: 1;
						padding: 0 10rpx 0 15rpx;
						position: relative;

						.name {
							font-size: 30rpx;
							font-weight: 400;
							color: #38393B;
							display: -webkit-box;
							overflow: hidden;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}

						.subtitle {
							margin-top: 25rpx;
							font-size: 21rpx;
							font-weight: 560;
							color: #999999;
							display: -webkit-box;
							overflow: hidden;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}

						.price {
							margin-top: 10rpx;
							color: #fff;
							background-color: #fff !important;
							padding-right: 10rpx;
							display: flex;
							font-size: 26rpx;

							view {
								background-color: #ff9f2d;
								border-radius: 8rpx;
								margin-right: 15rpx;
								padding: 4rpx 10rpx;
							}
						}

						.info {
							position: absolute;
							bottom: 0;
							left: 15rpx;
							color: red;
							font-weight: 560;
						}
					}
				}
			}

			.zhaopin_list {
				padding: 22rpx;
				background-color: #fff;

				.item {
					display: flex;
					padding-bottom: 20rpx;

					.left_cover {
						width: 210rpx;
						@include flex-center;
						padding: 10rpx 0;

						image {
							width: 200rpx;
							height: 200rpx;
						}
					}

					.right_info {
						flex: 1;
						padding: 0 10rpx 0 15rpx;
						position: relative;

						.name {
							font-size: 34rpx;
							font-weight: 400;
							color: #38393B;
						}

						.subtitle {
							margin-top: 15rpx;
							font-size: 30rpx;
							font-weight: 300;
							color: #38393B;
						}

						.price {
							width: 100%;
							font-weight: 560;
							text-align: right;
							color: #ffdf2c;
							padding-right: 10rpx;
						}

						.info {
							position: absolute;
							bottom: 0;
							left: 15rpx;
							font-size: 23rpx;
							color: #808080;
						}
					}
				}
			}

		}


	}
</style>
