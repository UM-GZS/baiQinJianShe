<template>
	<view class="detail_wrap" v-if="goodsDetailPic.length > 0">
		<!-- 头部轮播图 -->
		<view class="header">
			<u-swiper mode="number" height="500" indicator-pos="bottomRight" :list="list" :circular="true"></u-swiper>
		</view>
		<!-- 商品详情 -->
		<view class="goods_info">
			<view class="price">￥{{ detailData.price }}</view>
			<!-- <view class="desc">
				<view class="desc_item">直营车辆</view>
				<view class="desc_item">分期</view>
			</view> -->
			<view class="title">
				{{ detailData.name }}
			</view>
		</view>
		<!-- 运费 -->
		<view class="freight">
			<view class="post">
				<view>运费</view>
				<view class="freight_price">无需运费</view>
			</view>
			<view class="sale">
				<view>已售</view>
				<view class="count">{{ detailData.sales }}</view>
			</view>
		</view>
		<!-- 服务 -->
		<view class="service">
			<view class="delivery">
				<view>
					<text style="color: #b5b5b5;">服务</text>
					<text style="margin-left: 15rpx;">送货上门 48小时内发货</text>
				</view>
				<view>
					<image src="../../static/index/more.png" style="width: 20rpx;height: 30rpx;"></image>
				</view>
			</view>
			<view class="delivery"  @click="buyNow">
				<view>
					<text style="color: #b5b5b5;">选择</text>
					<text style="margin-left: 15rpx;">型号</text>
				</view>
				<view>
					<image src="../../static/index/more.png" style="width: 20rpx;height: 30rpx;"></image>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="goods_detail">
			<view class="title">商品详情</view>
			<!-- 详情内容 -->
			<view class="detail_content">
				<!-- 商品的参数图 -->
				<image style="width: 100%; margin-bottom: 20rpx;" :src="url + detailData.parameter_url">
				</image>
				<!-- 详情图 -->
				<view class="detail_pic"  style="width: 100%;display: flex;flex-direction: column;" v-if="goodsDetailPic.length > 0">
						<image style="width: 100%;" v-for="(item,index) in goodsDetailPic" :key="index" :src="item.image" @click="previewImg(item)">
						</image>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="collect common" v-if="order_types != 0" @click.stop="collect">
				<image src="../../static/user/collaction.png" style="width: 45rpx; height: 45rpx;" v-if="isCollect"></image>
				<image src="../../static/uview/common/collect.png" style="width: 45rpx; height: 45rpx;" v-else></image>
				<text>收藏</text>
			</view>
			<button open-type="contact" class="contact common" style="margin-left: 30rpx;">
				<image src="../../static/index/server.png" style="width: 50rpx; height: 50rpx;"></image>
				<text>客服</text>
			</button>
			<view class="buttom">
				<view class="collect" @click="collectNow">加入购物车</view>
				<view class="buy" @click="buyNow">立刻购买</view>
			</view>
		</view>
		<!-- 弹出层给用户选择 -->
		<u-mask :show="showSelect" @click="showSelect = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="info">
						<view class="left">
							<image :src="url + detailData.small_img_urls" style="width: 100%;height: 100%;"></image>
						</view>
						<view class="right">
							<view class="price">￥{{ detailData.price }}</view>
							<view class="select_type">
								<text>已选择</text>
								<text
									style="margin-left: 15rpx;">{{ currentModel!= null ? modelList[currentModel].name : '' }}</text>
							</view>
						</view>
					</view>
					<!-- 型号 -->
					<view class="model">
						<view class="title">型号</view>
						<view class="model_list">
							<view class="model_item" :class="index === currentModel ? 'activeModel' : ''"
								v-for="(item,index) in modelList" :key="item.id" @click="chooseModel(item,index)">
								{{ item.name }}
							</view>
						</view>
					</view>
					<!-- 购买数量 -->
					<view class="buy_count">
						<view>购买数量</view>
						<u-number-box :disabled="modelData.goods_model ? false : true" v-model="value"
							@change="valChange"></u-number-box>
					</view>
					<!-- next step-->
					<view class="next_step" @click="nextStep">
						{{isShowCollect ? '确定' : '下一步'}}
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import userApi from "../../network/user/userApi.js";
	//! 分类接口
	import categoryApi from '../../network/category/category.js';
	import machineApi from '../../network/machine/machine.js';
	import collectApi from '../../network/user/collect.js';
	import cartApi from '../../network/cart/cartApi.js';
	//! 防抖函数
	import tools from '../../utils/debounce/debounce.js';
	export default {
		data() {
			return {
				//! 判断是哪个页面进入当前
				order_types:'',
				//! 地址前缀
				url: getApp().globalData.requesturl,
				//! 数量
				value: 1,
				//!显示订单弹窗
				showSelect: false,
				//! 详情对象
				detailData: null,
				//! 轮播图
				list: [],
				//! 通过isCollect来判断用户是否时候收藏当前文章
				isCollect:null,
				// 记录选中的型号下标
				currentModel: null,
				//! 当前商品的型号列表
				modelList: [],
				//! 记录用户选择的型号id和数量
				modelData: {
					goods_model: null, // 型号id
					quantity: null // 数量
				},
				//! 产品的详情图
				goodsDetailPic:[],
				isShowCollect: false, // 控制弹窗类型
				userInfo: getApp().globalData.wxuser,
			}
		},
		onLoad(options) {
			//! 拿到id去请求对应的详情数据
			let {
				id,order_types
			} = options;
			this.order_types = order_types;
			if (id) {
				this.getDetail(id,order_types);
			}
			
		},
		methods: {
			/**
			 * 获取商品的详情
			 * @param {number} id
			 */
			 getDetail(id,order_types) {
				/**
				 * 判断对应的order_types
				 * 0新机置换 1为租赁订单 2为商品订单
				 * 对应请求详情的接口
				 */ 
				if(order_types == 0) {
					//! 请求新机置换的详情
					machineApi.machineDetail({id}).then(machineRes => {
						this.filterPic(machineRes);
						//! 往数组中添加商品型号
						this.modelList.push({id:1,name:machineRes.data.types})
						this.detailData = machineRes.data;
					})
				}else if(order_types == 1) {
					//! 请求租聘的接口
				}else if(order_types == 2) {
					//! 获取商品型号接口
					this.getGoodsModel(id);
					//! 请求商品详情的接口
				 categoryApi.goodsDetail({id}).then(goodRes => {
					 this.filterPic(goodRes);
					 this.detailData = goodRes.data;
					 this.getUserCollect(); //! 获取用户当前的收藏
				 })
				}
			},
			//! 转换图片的方法
			filterPic(res) {
				let list = JSON.parse(res.data.urls);
				let img_urls = JSON.parse(res.data.img_urls);
				//! 遍历数据追加到数组
				for (let i = 0; i < list.length; i++) {
					this.list.push({
						image: this.url + list[i].img
					});
				}
				for(let i = 0; i < img_urls.length;i++) {
					this.goodsDetailPic.push({
						image:this.url + img_urls[i].img
					})
				}
			},
			//! 获取商品的型号
			async getGoodsModel(id) {
				let queryInfo = {
					goods_id: id, //!商品id
					page_num: 1,
					page_size: 99, //! 请求数设置到最大数
					sort: 'id desc'
				}
				const res = await categoryApi.goodsModel(queryInfo);
				this.modelList = res.data.list;
			},
			//! 立即购买判断用户有没有登录
			buyNow() {
				if (!getApp().globalData.wxuser) {
					this.login(); //! 调用登录方法
					return;
				}
				this.showSelect = true;
				this.isShowCollect = false;
			},
			// 加入购物车
			collectNow() {
				if (!getApp().globalData.wxuser) {
					this.login(); //! 调用登录方法
					return;
				}
				this.showSelect = true;
				this.isShowCollect = true;
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
			//! 收藏按钮
			collect()  {
				//! 判断用户是否登录
				if(!getApp().globalData.wxuser) {
					 this.login(); //! 调用登录方法
					 return ;
				}
				//! 
				//! 判断当前用户是否已经收藏对应调用其相应接口
				if(this.isCollect) {
					//! 取消收藏
					collectApi.deleteCollect({id:this.isCollect.id}).then(delRes => {
						//! 重新获取数据
						this.getUserCollect();
					})
				}else {
					let data = {
						user_id:getApp().globalData.wxuser.id,
						collection_id:this.detailData.id,
						collection_status:1
					}
					//! 添加收藏
					collectApi.addCollect(data).then(addRes => {
						this.getUserCollect();
					})
				}
			},
			//! 获取当前用户的收藏数据
			async getUserCollect() {
				//! 判断当前用户是否登录
				if(!getApp().globalData.wxuser) {
					return;
				}
				let params = {
					user_id:getApp().globalData.wxuser.id,
					collection_id:this.detailData.id,
					collection_status:1, //!查询的类型
					sort:'id desc'
				}
				const res = await collectApi.getCollect(params);
				if(res.data.list.length) {
					this.isCollect = res.data.list[0];
				}else {
					this.isCollect = null;
				}
			},
			//! 图片预览函数
			previewImg(item) {
				let urls = [];
				for(let i = 0; i < this.goodsDetailPic.length; i++) {
					urls.push(this.goodsDetailPic[i].image);
				}
				uni.previewImage({
					current:item.image,
					urls,
					fail(err) {
						console.warn(err)
					}
				})
			},
			//! 选择型号
			chooseModel(item, index) {
				this.currentModel = index;
				// 记录选中商品
				this.modelData.goods_model = item.name; //!使用商品名称
			},
			//! 步进器的改变
			valChange(e) {
				this.modelData.quantity = e.value;
			},
			//!跳转订单界面
			async nextStep() {
				//! 判断用户是否已经选择内容
				if (!this.modelData.goods_model) {
					return getApp().globalData.global_Toast(true, "请选择商品的型号", function(res) {})
				}
				this.modelData.quantity = this.value;
				if (!this.modelData.quantity) {
					return getApp().globalData.global_Toast(true, "请选择型号数量", function(res) {})
				}
				/**
				 * 计算价格
				 */
				// 价格*数量
				let totalPrice = this.detailData.price * this.modelData.quantity;
				//! 提取出要发起订单的数据
				let orderData = {
					order_types:this.order_types, //! 订单类型(0:新机置换订单,1:租凭订单,2:商品订单)
					act_pay: totalPrice, //! 商品的总价格
					quantity: this.modelData.quantity, // 数量
					items: [{
						goods_id: this.detailData.id, // 商品id
						goods_name: this.detailData.name, // 商品名称
						goods_model: this.modelData.goods_model, // 型号名称
						img_url: this.detailData.small_img_urls, // 图片
						price: this.detailData.price, // 商品的单价
						quantity: this.modelData.quantity, // 数量
					}],
				}
				//! 用户点击下一步时写入将购物车数据写入vuex中
				if (this.isShowCollect) {
					let cartDetail = {
						user_id: this.userInfo.id,
						goods_id: this.detailData.id,
						goods_name: this.detailData.name,
						imgUrl: this.detailData.small_img_urls,
						price: this.detailData.price,
						goods_model: this.modelData.goods_model,
						quantity: this.modelData.quantity,
					}
					const resData = await cartApi.addCart(cartDetail)
					if (resData.code === 200) return getApp().globalData.global_Toast(true, "该商品已加入购物车", (res) => this.showSelect = false)
				}else {
					this.$store.commit("nextOrder", orderData);
					this.showSelect = false;
					uni.navigateTo({
						url: "../order/order"
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.detail_wrap {
		width: 100%;

		//!商品详情
		.goods_info {
			width: 100%;
			padding: 30rpx;
			background-color: #ffffff;

			.price {
				color: #ff0101;
				font-weight: 600;
				font-size: 45rpx;
				margin-bottom: 15rpx;
			}

			.desc {
				width: 100%;
				display: flex;
				margin-bottom: 15rpx;

				.desc_item {
					padding: 10rpx 20rpx;
					font-size: 25rpx;
					@include flex-center;
					color: #ffffff;
					border-radius: 10rpx;
					margin-right: 30rpx;
					background-color: #ffa02e;
				}
			}

			.title {
				width: 100%;
				font-weight: 700;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				font-size: 30rpx;
				overflow: hidden;
			}
		}

		//! 运费
		.freight {
			width: 100%;
			@include flex-jcsb;
			padding: 20rpx 30rpx;
			margin-top: 30rpx;
			background-color: #ffffff;
			color: $gray_color;

			.post {
				@include flex-center;

				.freight_price {
					color: $black_color;
					margin-left: 30rpx;
					font-weight: 400;
					font-size: 28rpx;
				}
			}

			.sale {
				@include flex-center;

				.count {
					color: $black_color;
					margin-left: 30rpx;
					font-weight: 400;
					font-size: 28rpx;
				}
			}
		}

		//!服务
		.service {
			width: 100%;
			margin-top: 30rpx;
			background-color: #ffffff;
			@include flex-col;

			.delivery {
				width: 100%;
				padding: 20rpx 30rpx;
				@include flex-jcsb;
			}
		}

		//!商品详情
		.goods_detail {
			margin-top: 30rpx;
			width: 100%;

			.title {
				width: 100%;
				margin-bottom: 10rpx;
				padding: 20rpx 0;
				@include flex-center;
				background-color: #ffffff;
			}

			.detail_content {
				width: 100%;
				display: flex;
				flex-direction: column;
				padding-bottom: 90rpx;
			}
		}

		//! 底部按钮
		.footer {
			width: 100%;
			height: 90rpx;
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
				padding: 30rpx 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
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

			.buttom {
				height: 100%;
				margin-left: 30rpx;
				flex: 1;
				@include flex-center;
				font-weight: 500;
				color: black;
				font-size: 30rpx;
				border-radius: 50rpx;
				
				&>view {
					width: 50%;
					height: 100%;
					line-height: 70rpx;
					text-align: center;
				}
				
				.collect {
					background-color: #FDDF2F;
					border-radius: 50rpx 0rpx 0rpx 50rpx;
				}
				
				.buy {
					background: #F76F7D;
					border-radius: 0rpx 50rpx 50rpx 0rpx;
					color: #FFFFFF;
				}
			}
		}

		.warp {
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: flex-end;
			height: 100%;

			.rect {
				width: 100%;
				// height: 680rpx;
				padding: 30rpx;
				border-top-left-radius: 30rpx;
				border-top-right-radius: 30rpx;
				background-color: #ffffff;
				padding-bottom: 20rpx;

				.info {
					width: 100%;
					display: flex;

					.left {
						width: 160rpx;
						height: 160rpx;
						border: 1rpx solid $gray_color;
					}

					.right {
						margin-left: 30rpx;
						display: flex;
						flex-direction: column;
						justify-content: flex-end;

						.price {
							color: #ff0000;
							font-weight: 800;
							font-size: 35rpx;
						}

						.select_type {
							display: flex;
							font-size: 25rpx;
							margin-top: 10rpx;
							font-weight: 600;
							color: $gray_color;
						}
					}
				}

				//!型号
				.model {
					width: 100%;
					margin-top: 20rpx;
					margin-bottom: 10rpx;

					.model_list {
						width: 100%;
						margin-top: 20rpx;
						margin-bottom: 20rpx;
						display: flex;
						flex-wrap: wrap;

						.model_item {
							padding: 10rpx 25rpx;
							border-radius: 15rpx;
							margin-right: 15rpx;
							margin-bottom: 15rpx;
							background-color: #f2f2f2;
						}

						.activeModel {
							background-color: #cdcbce;
						}
					}
				}

				//!购买数量
				.buy_count {
					width: 100%;
					@include flex-jcsb;
					margin-top: 10rpx;
					margin-bottom: 30rpx;
				}

				.next_step {
					margin: 30rpx auto;
					width: 80%;
					height: 60rpx;
					background-color: $page_color;
					border-radius: 50rpx;
					@include flex-center;
				}
			}
		}

	}
</style>
