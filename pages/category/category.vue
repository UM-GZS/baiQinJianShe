<template>
	<view class="cate_wrap">
		<view class="header_search">
			<u-search input-align="center" bg-color="#FFFFFF" height="65" placeholder="输入您想要的商品或服务" v-model="searchData" @custom="search" @search="search"></u-search>
		</view>
		<view class="content_wrap">
			<!-- 左边的分类类别 -->
			<scroll-view @scrolltolower="cate_bottom" class="left_cate" scroll-y enable-flex>
				<!-- 显示分类的每一项 -->
				<view class="cate_item" v-for="(item,index) in cate_list" :key="index"
					:class="index === current ? 'active_cate'  :''" @click="changeCate(index,true)">{{ item.name }}</view>
			</scroll-view>
			<!-- 右边详情数据 -->
			<scroll-view @scrolltolower="detail_bottom" class="cate_content" scroll-y enable-flex>
				<!-- 商品子分类的标题 -->
				<view style="margin: 25rpx 0;" v-for="(subItem,subIndex) in subCategory" :key="subIndex">
					<view class="cate_title">
						{{ subItem.name }}
					</view>
					<view class="content_box" v-for="(item,index) in cate_detail" :key="item.id">
						<view class="content_item" v-if="item.goods_category_id === subItem.id" @click="detail(item.id)">
							<image style="width: 100%;height: 150rpx;border: 1rpx solid #b5b5b5;"
								:src="url + item.small_img_urls"></image>
							<view class="goods_name">
								{{ item.name }}
							</view>
							<view class="info">
								<view class="price">
									￥{{ item.price }}
								</view>
								<view class="sale">
									<text>已售:</text>
									<text>{{ item.sales }}</text>
									<text>件</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import categoryApi from "../../network/category/category.js";
	
	export default {
		data() {
			return {
				//!判断是否再次请求
				flag: false,
				// 图片地址前缀
				url: getApp().globalData.requesturl,
				//! 默认请求下标为1的数据
				current: 0,
				//! 左边列表的请求参数
				leftCateInfo: {
					page_num: 1,
					page_size: 15,
					sort: 'id asc'
				},
				//! 右边详情的请求参数
				rightDeatilInfo: {
					page_num: 1,
					page_size: 10,
					sort: 'id asc', //!排序方式
					shelf: true //! 上架的标识
				},
				//! 右边详情数据的总数
				rightTotal:null,
				//! 子分类的请求数据
				subCateInfo: {
					page_num: 1,
					page_size: 999,
					sort: 'id asc'
				},
				//! 左边分类数据
				cate_list: [],
				//! 左边数据的总和
				leftTotal:0,
				//! 判断是否还有更多数据
				hasMore:true,
				//! 子分类的数据
				subCategory: [],
				// 右边详情数据
				cate_detail: [],
				searchData: ''
			}
		},
		methods: {
			// 点击搜索按钮
			search() {
				if (!this.searchData.trim()) return getApp().globalData.global_Toast(true, "请输入搜索内容", (res) => {})
				uni.navigateTo({
					url:"../../subPackages/search/search?searchData=" + this.searchData
				})
			},
			//! 组件显示的时候调用的网络请求
			ontrueGetList() {
				//! 判断当前界面是否发送过网络请求
				if (!this.flag) {
					this.categoryList(this.leftCateInfo);
					//! 为true不在请求
					this.flag = true;
				}
			},
			// 左边分类列表
			async categoryList(queryInfo) {
				const res = await categoryApi.categoryList(queryInfo);
				this.cate_list = res.data.list;
				this.leftTotal = res.data.total;
				//! 调用分类详情的商品数据
				//!默认请求数组第一个分类的内容
				this.changeCate(0);
			},
			//! 左边列表的切换获取对应的右边数据详情
			async changeCate(index,flag) {
				/**
				 * 根据flag来判断是否请求数据然后重新发起请求
				 * true 表示要请求默认的数据 切换分类要重新请求
				 */ 
				if(flag) {
					//! 清除数据
					this.clearData(); 
				}
				
				//! 请求分类对应商品详情数据
				let params = {
					//!取出对应的分类id
					category_id: this.cate_list[index].id,
					...this.rightDeatilInfo
				}
				//! 得到分类的详情数据
				const res = await categoryApi.goodsList(params);
				//! 存储数据 解构数据
				this.cate_detail = [...this.cate_detail,...res.data.list];
				//! 记录右边数据的总数
				this.rightTotal = res.data.total;
				//! 请求对应的子类数据，根据下标拿取分类的id
				this.subCategoryList(this.cate_list[index].id,this.subCateInfo);
				//! 切换显示下标
				this.current = index;
			},
			//! 子分类的网络请求
			async subCategoryList(category_id,queryInfo) {
				let params = {
					category_id,
					...queryInfo
				}
				const subList = await categoryApi.subCategory(params);
				//! 解构数据
				this.subCategory = subList.data.list;
			},
			/**
			 * 左边分类到达底部触发
			 */
			cate_bottom() {
				// 取反判断是否还有更多数据
				if(!(this.leftCateInfo.page_num * this.leftCateInfo.page_size >= this.leftTotal)) {
					this.leftCateInfo.page_num ++;
					categoryApi.categoryList(this.leftCateInfo).then(res => {
						this.cate_list = [...this.cate_list,...res.data.list];
					});
				}
			},
			/**
			 * 右边详情页面到底函数
			 */
			detail_bottom() {
				/**
				 * 判断请求数量是否超出总数
				 * 页面到底请求更多的详情数据
				 */
				let {page_num,page_size} = this.rightDeatilInfo;
				if((page_num * page_size) >= this.rightTotal) {
					return getApp().globalData.global_Toast(true,"没有更多数据了",function(res){})
				}
				//! 修改参数请求更多数据
				this.rightDeatilInfo.page_num ++;
				// 根据当前选中的下标获取对应分类数组中item项的id
				this.changeCate(this.current,false);
				
			},
			/**
			 * 清除初始化数据
			 */
			clearData() {
				//! 初始化请求参数
				this.rightDeatilInfo = {
					page_num: 1,
					page_size: 10,
					sort: 'id asc', //!排序方式
					shelf: true //! 上架的标识
				}
				//! 清除详情数据
				this.cate_detail = [];
				//! 清除子类详情数据
				this.subCategory = [];
			},
			//! 跳转详情界面
			detail(id) {
				/**
				 * 跳转传递order_types来判断是从哪个界面进入
				 * 0表示新机置换 1表示租赁订单 2商品分类订单
				 */ 
				
				uni.navigateTo({
					url: `../../subPackages/category/category_detail?order_types=2&id=${id}`
				})
			}
		},
	}
</script>
<style lang="scss" scoped>
	.cate_wrap {
		width: 100%;
		background: #F2F2F2;

		.content_wrap {
			width: 100%;
			height: calc(100vh - 100rpx);
			display: flex;

			//! 左边列表数据
			.left_cate {
				width: 200rpx;
				height: 100%;
				padding: 20rpx 10rpx;
				background-color: #ffffff;
				border-right: 1px solid #F2F2F2;

				.cate_item {
					width: 100%;
					@include flex-center;
					border-radius: 15rpx;
					margin-bottom: 20rpx;
					padding: 15rpx 0;
				}

				.active_cate {
					background-color: $page_color;
				}
			}

			.cate_content {
				flex: 1;
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				padding-top: 20rpx;

				.cate_title {
					width: 100%;
					padding-left: 15rpx;
					font-size: 32rpx;
					font-weight: 600;
					margin-bottom: 15rpx;
				}

				//! 子分类下的盒子
				.content_box {
					width: 100%;
					// display: flex;
					.content_item {
						@include flex-col;
						box-sizing: border-box;
						float: left;
						width: 33.3%;
						padding: 10rpx 15rpx;
						margin-bottom: 5rpx;
					
						.goods_name {
							margin-top: 10rpx;
							font-size: 20rpx;
							color: #656366;
							letter-spacing: 1rpx;
							@include clamp2;
						}
					
						.info {
							@include flex-jcsb;
							margin-top: 10rpx;
							width: 100%;
					
							// 价格
							.price {
								color: red;
								font-weight: 600;
								font-size: 25rpx;
							}
					
							.sale {
								@include flex-center;
								font-size: 15rpx;
								color: $gray_color;
							}
						}
					}
				}
			}
		}
	}
	
	.header_search {
		padding: 15rpx 20rpx;
	}
</style>
