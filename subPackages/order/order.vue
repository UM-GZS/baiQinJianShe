<template>
	<view class="order_wrap">
		<!-- 头部信息 -->
		<view class="goods_info">
			<!-- 上边内容 -->
			<view class="goods_content" v-for="(item, index) in carData.items" :key="index">
				<!-- 左边图片 -->
				<view class="left_pic">
					<image style="width: 100%;height: 100%;" :src="url + item.img_url"></image>
				</view>
				<!--右边详情 -->
				<view class="right_msg">
					<view class="name">
						{{ item.goods_name }}
					</view>
					<!-- 已选型号 -->
					<view class="select_type">
						<view class="type_title" style="margin-bottom: 10rpx;">
							已选择：
						</view>
						<view class="select_item" >
							<view class="model">
								{{ item.goods_model }}
							</view>
							<view class="model_count" >
								x{{ item.quantity }}
							</view>
						</view>
					</view>
					<!-- 当前商品的价格 -->
					<view class="price">
						￥{{ item.price }}
					</view>
				</view>
			</view>
			<!-- 显示已选商品的数量 -->
			<view class="select_goods">
				<!-- 商品数量 -->
				<view class="total_count">
					<text>共{{ carData.quantity }}件</text>
				</view>
				<view class="total_price">
					<text>商品小计:</text>
					<text>￥{{ carData.act_pay }}</text>
				</view>
			</view>
		</view>
		<!-- 优惠券 -->
		<!-- <view class="coupon">
			<view>优惠券</view>
			<view class="use_coupon">
				<text style="margin-right: 15rpx;">暂无可用</text>
				<image src="../../static/index/more.png" style="width: 20rpx;height: 30rpx;"></image>
			</view>
		</view> -->
		<!-- 地址为空前往选择收货地址 -->
		<view class="select_address" @click="chooseAddress" v-if="!userAddress">
			<text>收货地址</text>
			<view class="right_msg">
				<text style="color: #b5b5b5;margin-right: 15rpx;">前往选择收货地址</text>
				<image src="../../static/index/more.png" style="width: 20rpx;height: 30rpx;"></image>
			</view>
		</view>
		<!--收货地址用于选择收货地址或者有默认地址的情况下显示 -->
		<view class="address" v-else @click="chooseAddress">
			<view class="address_info">
				<view class="address_item">
					<view class="title">
						收货人
					</view>
					<view class="detail">
						{{ userAddress.name }}
					</view>
				</view>
				<view class="address_item">
					<view class="title">
						联系电话
					</view>
					<view class="detail">
						{{ userAddress.phone }}
					</view>
				</view>
				<view class="address_item">
					<view class="title">
						收货地址
					</view>
					<view class="detail">
						{{ userAddress.region }}{{ userAddress.detail }}
					</view>
				</view>
				<!-- <view class="address_item">
					<view class="title">
						订单编号
					</view>
					<view class="detail">
						56451556156
					</view>
				</view> -->
			</view>
			<view class="right_icon">
				<image src="../../static/index/more.png" style="width: 20rpx;height: 30rpx;"></image>
			</view>
		</view>
		<!-- 买家留言 -->
		<view class="message">
			<text>买家留言</text>
			<u-input v-model="remark" input-align="right" height="60" type="text" placeholder="留言建议提前协商" trim />
		</view>
		<view class="page-null"></view>
		<!-- 订单提交 -->
		<view class="order_submit">
			<view class="order_price">
				<text>应付:</text>
				<text style="color: #ff0101;
						font-weight: 600;
						font-size: 30rpx;">￥{{ carData.act_pay }}</text>
			</view>
			<view class="submit" @click="submit">
				提交订单
			</view>
		</view>
		<!-- 提示用户复制客服电话 -->
		<u-top-tips ref="uTips" z-index="10080"></u-top-tips>
		<!-- 订单提交成功的遮罩层 -->
		<u-mask :show="showOrder" @click="accept">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="title">
						<text>订单提交成功</text>
					</view>
					<view class="tips">
						<view class="tips_content">
							订单已成功提交,24小时内客服会进行受理
						</view>
						<view class="contact" @longtap="copy('xwbkf01')">
							<text>客服微信联系方式:</text>
							<text>xwbkf01</text>
						</view>
					</view>
					<!-- 完成-->
					<view class="accept" @click="accept">
						完成
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import categoryApi from "../../network/category/category.js";
	import userApi from "../../network/user/addressApi.js";
	import orderApi from "../../network/order/order.js";
	export default {
		data() {
			return {
				//!地址
				url: getApp().globalData.requesturl,
				//!显示遮罩层
				showOrder: false,
				//! 买家留言
				remark:'',
				//! 购物车的订单列表
				carData: null,
				//! 型号列表
				modelList: [],
				//!用户收货地址
				userAddress: null,
				userInfo: getApp().globalData.wxuser
			}
		},
		onLoad() {
			// 获取vuex中的购物车订单
			this.carData = this.$store.state.shopCarData;
			console.log("购物车",this.carData)
			this.getAddress();
		},
		onShow() {
			//! 获取vuex中收货地址的数据
			const address = this.$store.state.deliveryAddress;
			if(address) {
				this.userAddress = address;
			}
		},
		methods: {
			//! 获取用户的收货地址
			async getAddress() {
				let queryInfo = {
					user_id: this.userInfo.id,
					page_num: 1,
					page_size: 20,
					def: true //! 获取默认地址
				}
				const res = await userApi.getAddressList(queryInfo);
				console.log("用户收货地址",res)
				if (res.data.list.length > 0) {
					this.userAddress = res.data.list[0];
				}

			},
			//! 跳转收货地址界面
			chooseAddress() {
				uni.navigateTo({
					url: "../../pages/address/address?type=order"
				})
			},
			//! 提交订单
			async submit() {
				// 判断用户是否填写收货地址
				if(!this.userAddress) {
					return getApp().globalData.global_Toast(true,"请选择收货地址",function(res){})
				}
				//! 订单的对象数据
				let queryInfo = {
					user_id: this.userInfo.id,
					order_types: this.carData.order_types,
					deliv_name: this.userAddress.name,
					deliv_phone: this.userAddress.phone,
					deliv_address: this.userAddress.region + this.userAddress.detail,
					remark: this.remark,
					status: 1,
					act_pay: this.carData.act_pay,
					items: JSON.stringify(this.carData.items),
				}
				
				const orderRes = await orderApi.addOrder(queryInfo);
				//! 表示成功添加
				if(orderRes.data.id) {
					this.showOrder = true;
					//! 提示用户可复制客服电话号码
					this.$refs.uTips.show({
						title: '长按客服号码,可复制联系方式',
						type: 'success',
						duration: '5000'
					})
				}
			},
			//! 点击完成后回退页面
			accept() {
				this.showOrder = false;
				//! 清除数据 清除vuex中的收货地址
				this.$store.commit('clearAddress');
				this.userAddress = null;
				uni.navigateBack({
					delta: 1
				})
			},
			//!长按复制
			copy(value) {
				uni.setClipboardData({
					data: value,
					success: function() {
						getApp().globalData.global_Toast(true, "复制成功", function(res) {})
					},
					fail: function(err) {
						console.log(err)
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.order_wrap {
		width: 100%;
		padding: 30rpx 0;

		.goods_info {
			width: 100%;
			padding: 30rpx;
			background-color: #ffffff;
			border-radius: 15rpx;

			.goods_content {
				width: 100%;
				display: flex;
				align-items: flex-start;
				justify-content: center;

				.left_pic {
					width: 160rpx;
					height: 160rpx;
					border: 1rpx solid $gray_color;
				}

				.right_msg {
					flex: 1;
					height: 100%;
					margin-left: 20rpx;

					.name {
						width: 100%;
						font-weight: 700;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						font-size: 30rpx;
						overflow: hidden;
					}

					//！ 拥有的服务
					.desc {
						width: 100%;
						display: flex;
						margin-bottom: 15rpx;

						.desc_item {
							margin-top: 15rpx;
							padding: 6rpx 20rpx;
							font-size: 22rpx;
							@include flex-center;
							color: #ffffff;
							border-radius: 10rpx;
							margin-right: 30rpx;
							background-color: #ffa02e;
						}
					}

					//! 已选型号
					.select_type {
						width: 100%;
						display: flex;
						margin-top: 30rpx;
						flex-direction: column;
						color: $gray_color;
						align-items: flex-start;
						flex-wrap: wrap;

						.select_item {
							width: 100%;
							@include flex-jcsb;
						}
					}

					//! 当前商品价格
					.price {
						margin-top: 20rpx;
						color: #ff0101;
						font-weight: 600;
						font-size: 30rpx;
						margin-bottom: 15rpx;
					}
				}
			}

			//!显示已选商品数据
			.select_goods {
				width: 100%;
				margin-top: 30rpx;
				display: flex;
				justify-content: flex-end;

				.total_price {
					margin-left: 20rpx;
				}
			}
		}

		//! 优惠券
		.coupon {
			width: 100%;
			padding: 30rpx;
			margin-top: 20rpx;
			background-color: #ffffff;
			@include flex-jcsb;

			.use_coupon {
				@include flex-center;
			}
		}

		//! 没有收货地址的样式
		.select_address {
			width: 100%;
			padding: 30rpx;
			margin-top: 20rpx;
			background-color: #ffffff;
			@include flex-jcsb;

			.right_msg {
				@include flex-center;
			}
		}

		//! 收货地址
		.address {
			width: 100%;
			padding: 30rpx;
			margin-top: 20rpx;
			background-color: #ffffff;
			@include flex-jcsb;

			.address_item {
				margin-bottom: 15rpx;
				color: $gray_color;
				display: flex;
				align-items: center;

				.title {
					width: 150rpx;
				}

				.detail {
					color: black;
				}
			}
		}

		//! 买家留言
		.message {
			width: 100%;
			padding: 20rpx 30rpx;
			margin-top: 20rpx;
			@include flex-jcsb;
			background-color: #ffffff;
		}

		.order_submit {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 90rpx;
			padding: 10rpx 30rpx;
			background-color: #ffffff;
			@include flex-jcsb;
			z-index: 1000;

			.submit {
				width: 300rpx;
				font-weight: 600;
				height: 100%;
				border-radius: 50rpx;
				background-color: $page_color;
				@include flex-center;
			}
		}

		//!遮罩层
		.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			padding: 0 30rpx;

			.rect {
				width: 100%;
				padding: 30rpx;
				border-radius: 15rpx;
				background-color: #fff;
				display: flex;
				flex-direction: column;
				align-items: center;

				.title {
					width: 100%;
					text-align: center;
					margin-bottom: 20rpx;
					font-size: 30rpx;
					font-weight: 600;
				}

				.tips {
					width: 100%;

					.tips_content {
						margin-bottom: 30rpx;
					}
				}

				.accept {
					margin-top: 30rpx;
					width: 350rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					color: #ffffff;
					background-color: $page_color;
					border-radius: 15rpx;
				}
			}
		}
	}
	
	.page-null {
		width: 100%;
		height: 150rpx;
	}
</style>
