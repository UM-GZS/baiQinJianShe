<template>
	<view class="container">
		<view class="container_top flex flex_middle flex_right" v-if="goodsList.length > 0">
			<view class="top_edit" @click="editClick">{{isEdit ? '完成' : '编辑'}}</view>
		</view>

		<view class="container_box" v-if="goodsList.length > 0">
			<view class="box_item flex flex_middle" v-for="(item, index) in goodsList" :key="index">
				<view class="item_radio" :class="item.isRadio ? 'isRadio' : ''" @click="radioClick(index)"></view>
				<view class="item_image">
					<image :src="url + item.img_url"></image>
				</view>
				<view class="item_info">
					<view class="info_label flex flex_middle">
						<text class="label_list" v-for="(label, ind) in item.label" :key="ind">{{label}}</text>
					</view>
					<view class="info_name">{{item.goods_name}}</view>
					<view class="info_detail flex flex_middle flex_between">
						<view class="detail_model" @click="openPopup(item.goods_id, index)">{{item.goods_model}}</view>
						<view class="detail_quantity">
							<view class="quantity_change flex flex_middle" v-if="isEdit">
								<text @click="quantityChange('reduce', index)">-</text>
								<text>{{item.quantity}}</text>
								<text @click="quantityChange('plus', index)">+</text>
							</view>
							<view class="quantity_item" v-else>×{{item.quantity}}</view>
						</view>
					</view>
					<view class="info_price">￥{{item.price}}</view>
				</view>
			</view>
		</view>

		<none-data :text="'购物车暂无数据~'" v-else></none-data>

		<view class="page-null"></view>

		<u-mask :show="showMask" @click="showMask = false">
			<view class="warp flex flex_allcenter">
				<view class="rect flex flex_column flex_allcenter" @tap.stop>
					<view class="mask_title">确认提交</view>
					<view class="mask_close" @click="showMask = false">×</view>
					<view class="mask_tips">确认提交购买订单吗？</view>
					<view class="mask_button" @click="maskSubmit">确认提交</view>
				</view>
			</view>
		</u-mask>

		<view class="container_bottom flex flex_between flex_middle">
			<view class="bottom_left flex flex_middle">
				<view class="item_radio" :class="isAllRadio ? 'isRadio' : ''" @click="allRadioClick"></view>
				<text>全选</text>
			</view>
			<view class="bottom_right flex flex_middle">
				<view class="right_sum">合计: <text>￥{{totalPrice}}</text></view>
				<view class="right_settlement" @click="cartDetele" v-if="isEdit">删除</view>
				<view class="right_settlement" @click="cartPay" v-else>结算({{totalQuantity}})</view>
			</view>
		</view>

		<u-mask :show="showSelect" @click="showSelect = false">
			<view class="popup_warp">
				<view class="rect" @tap.stop>
					<view class="info">
						<view class="left">
							<image :src="url + currentDetail.small_img_urls" style="width: 100%;height: 100%;"></image>
						</view>
						<view class="right">
							<view class="price">￥{{ currentDetail.price }}</view>
							<view class="select_type">
								<text>已选择</text>
								<text style="margin-left: 15rpx;">{{ currentDetail.currentModel!= null ? currentDetail.modelList[currentDetail.currentModel].name : '' }}</text>
							</view>
						</view>
					</view>
					<!-- 型号 -->
					<view class="model">
						<view class="title">型号</view>
						<view class="model_list">
							<view class="model_item" :class="index === currentDetail.currentModel ? 'activeModel' : ''" v-for="(item, index) in currentDetail.modelList" :key="item.id" @click="chooseModel(item, index)">
								{{ item.name }}
							</view>
						</view>
					</view>
					<!-- 购买数量 -->
					<view class="buy_count">
						<view>购买数量</view>
						<u-number-box :disabled="currentDetail.goods_model ? false : true" v-model="currentDetail.quantity" @change="valChange"></u-number-box>
					</view>
					<!-- next step-->
					<view class="next_step" @click="nextStep">确定</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import cartApi from '../../network/cart/cartApi.js';
	import categoryApi from '../../network/category/category.js';
	import noneData from "../../components/none-data/none-data";

	export default {
		data() {
			return {
				isAllRadio: false, // 全选状态
				isEdit: false, // 是否是编辑状态
				userInfo: getApp().globalData.wxuser,
				url: getApp().globalData.requesturl,
				goodsList: [],
				totalPrice: 0,
				totalQuantity: 0,
				showMask: false,
				showSelect: false,
				currentDetail: {},
				currentGoods: null
			}
		},
		components: {
			noneData
		},
		onShow() {
			this.goodsList = [];
			this.isAllRadio = false;
			this.totalPrice = 0;
			this.totalQuantity = 0;
			this.getCartList();
		},
		methods: {
			// 当前编辑商品弹窗
			async openPopup(goodsId, index) {
				if (!this.isEdit) return;
				let queryInfo = {
					goods_id: goodsId,
					page_num: 1,
					page_size: 99,
					sort: 'id desc'
				}
				categoryApi.goodsModel(queryInfo).then(resData => {
					let currentModel = resData.data.list.findIndex(item => item.name == this.goodsList[index].goods_model);
					this.currentDetail.currentModel = currentModel;
					this.currentDetail.quantity = this.goodsList[index].quantity;
					this.currentDetail.goods_model = this.goodsList[index].goods_model;
					this.currentGoods = index;
					this.currentDetail.modelList = resData.data.list;
					this.getCurrentGoods(goodsId);
				})
			},
			// 获取当前编辑商品
			getCurrentGoods(goodsId) {
				categoryApi.goodsDetail({ id: goodsId }).then(resData => {
					this.currentDetail = { ...this.currentDetail, ...resData.data };
					this.showSelect = true;
				})
			},
			// 选择当前编辑商品型号
			chooseModel(item, index) {
				this.currentDetail.currentModel = index;
				this.currentDetail.goods_model = item.name;
			},
			// 步进器的改变
			valChange(e) {
				this.currentDetail.quantity = e.value;
			},
			// 当前编辑商品点击确定
			async nextStep() {
				let currentData = this.currentDetail;
				if (!currentData.quantity) {
					return getApp().globalData.global_Toast(true, "请选择型号数量", function(res) {})
				}
				let cartDetail = {
					id: this.goodsList[this.currentGoods].id,
					user_id: this.userInfo.id,
					goods_id: currentData.id,
					goods_name: currentData.name,
					imgUrl: currentData.small_img_urls,
					price: currentData.price,
					goods_model: currentData.goods_model,
					quantity: currentData.quantity,
				}
				const resData = await cartApi.updateCart(cartDetail)
				if (resData.code === 200) return getApp().globalData.global_Toast(true, "商品修改成功~", res => {
					this.showSelect = false;
					this.goodsList[this.currentGoods].goods_model = currentData.goods_model;
					this.goodsList[this.currentGoods].quantity = currentData.quantity;
				})
			},
			// 获取购物车列表
			async getCartList() {
				const resData = await cartApi.cartList({ id: this.userInfo.id })
				if (resData.code === 200) {
					if (resData.data.list.length > 0) {
						resData.data.list.forEach(item => item.isRadio = false);
						this.goodsList = [...this.goodsList, ...resData.data.list];
					}
				}
			},
			// 点击单个商品单选
			radioClick(index) {
				let currectGoods = this.goodsList[index];
				if (!currectGoods.isRadio) {
					this.totalPrice += currectGoods.price * currectGoods.quantity;
					this.totalQuantity += currectGoods.quantity;
				} else {
					this.totalPrice -= currectGoods.price * currectGoods.quantity;
					this.totalQuantity -= currectGoods.quantity;
				}
				currectGoods.isRadio = !currectGoods.isRadio;
				let findData = this.goodsList.find(item => !item.isRadio);
				if (findData) this.isAllRadio = false;
				else this.isAllRadio = true;
			},
			// 点击全选按钮
			allRadioClick() {
				this.isAllRadio = !this.isAllRadio;
				this.totalPrice = 0;
				this.totalQuantity = 0;
				if (this.isAllRadio) {
					this.goodsList.forEach(item => {
						item.isRadio = true;
						this.totalPrice += item.price * item.quantity;
						this.totalQuantity += item.quantity;
					});
				} else this.goodsList.forEach(item => item.isRadio = false);
			},
			// 点击编辑按钮
			editClick() {
				this.goodsList.forEach(item => item.isRadio = false);
				this.isAllRadio = false;
				this.totalPrice = 0;
				this.totalQuantity = 0;
				this.isEdit = !this.isEdit;
			},
			// 点击商品数量加减
			quantityChange(type, index) {
				if (this.goodsList[index].quantity == 1 && type == 'reduce') return;
				if (type === 'reduce') this.goodsList[index].quantity--;
				else this.goodsList[index].quantity++;
			},
			// 购物车结算
			cartPay() {
				let cartList = this.goodsList.filter(item => item.isRadio);
				if (cartList.length == 0) return getApp().globalData.global_Toast(true, "请选择结算的商品", (res) => {});
				this.showMask = true;
			},
			// 删除购物车
			async cartDetele() {
				let idList = [];
				this.goodsList.forEach(item => {
					if (item.isRadio) idList.push(item.id);
				})
				if (idList.length == 0) return getApp().globalData.global_Toast(true, "请选择删除的商品", (res) => {});
				const resData = await cartApi.cartDetele({ id: idList });
				if (resData.code === 200) getApp().globalData.global_Toast(true, "删除成功", (res) => {
					this.totalPrice = 0;
					this.totalQuantity = 0;
					this.isAllRadio = false;
					this.isEdit = !this.isEdit;
					this.goodsList = [];
					this.getCartList();
				});
			},
			// 点击弹窗mask确认按钮
			maskSubmit() {
				this.showMask = false;
				let cartList = this.goodsList.filter(item => item.isRadio);
				let orderData = {
					order_types: 2,
					act_pay: this.totalPrice,
					quantity: this.totalQuantity,
					items: cartList,
				}
				this.$store.commit("nextOrder", orderData);
				setTimeout(() => {
					uni.navigateTo({ url: "../order/order" })
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2;
	}

	.container {
		width: 100%;
	}

	.page-null {
		width: 100%;
		height: 150rpx;
	}

	.container_top {
		margin: 0rpx 30rpx;
		height: 80rpx;

		.top_edit {
			width: 100rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			border-radius: 50rpx;
			background: #FFDF2C;
			font-size: 24rpx;
		}
	}

	.container_box {
		width: 100%;
	}

	.box_item {
		padding: 0rpx 26rpx;
		height: 276rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		border: 1px solid #F2F2F2;

		.item_image {
			margin: 0rpx 24rpx 0rpx 20rpx;
			width: 222rpx;
			height: 222rpx;

			&>image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.item_radio {
		position: relative;
		width: 25rpx;
		height: 25rpx;
		border-radius: 50%;

		&::before {
			content: '';
			position: absolute;
			top: -7rpx;
			left: -7rpx;
			right: 0;
			bottom: 0;
			width: calc(100% + 9rpx);
			height: calc(100% + 9rpx);
			border-radius: 50%;
			border: 1px solid #DDDDDD;
		}

		&.isRadio {
			background: #CCCCCC;
		}
	}

	.item_info {
		width: calc(100% - 300rpx);

		&>view {
			width: 100%;
		}

		.info_label {
			&>text {
				margin-right: 24rpx;
			}

			.label_list {
				width: 100rpx;
				height: 34rpx;
				line-height: 34rpx;
				border-radius: 8rpx;
				background: #FFA02E;
				text-align: center;
				color: #FFFFFF;
				font-size: 20rpx;
			}
		}

		.info_name {
			margin-top: 12rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #38393B;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.info_detail {
			margin-top: 20rpx;
			height: 50rpx;
			font-size: 20rpx;
			color: #808080;

			.detail_model {
				padding: 5rpx 15rpx;
				font-size: 20rpx;
				color: #38393B;
				background: #CCCCCC;
				border-radius: 10rpx;
			}

			.detail_quantity {
				.quantity_change {
					&>text {
						width: 34rpx;
						height: 34rpx;
						line-height: 34rpx;
						text-align: center;
						background: #F2F2F2;
						font-size: 30rpx;
						color: #CCCCCC;
					}

					&>text:nth-child(2) {
						margin: 0rpx 10rpx;
						background: #E6E6E6;
						font-size: 25rpx;
						color: #000000;
					}
				}

				.quantity_item {
					font-size: 20rpx;
					color: #808080;
				}
			}
		}

		.info_price {
			margin-top: 20rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: #FF0000;
		}
	}

	.container_bottom {
		width: 100%;
		height: 90rpx;
		background: #FFFFFF;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.bottom_left {
		margin-left: 30rpx;
		font-size: 26rpx;
		color: #38393B;

		.item_radio {
			margin-right: 20rpx;
		}
	}

	.bottom_right {
		margin-right: 30rpx;
		font-weight: bold;
		color: #38393B;

		.right_sum {
			font-size: 26rpx;

			&>text {
				font-size: 28rpx;
				color: #FF0000;
			}
		}

		.right_settlement {
			margin-left: 20rpx;
			width: 210rpx;
			height: 70rpx;
			line-height: 68rpx;
			background: #FFDF2C;
			text-align: center;
			font-size: 30rpx;
			border-radius: 50rpx;
		}
	}

	.warp {
		height: 100%;

		.rect {
			position: relative;
			width: 90%;
			height: 300rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			.mask_close {
				position: absolute;
				top: 0rpx;
				right: 20rpx;
				font-size: 50rpx;
			}

			.mask_title {
				width: 100%;
				font-size: 34rpx;
				font-weight: bold;
				text-align: center;
			}

			.mask_tips {
				margin: 40rpx 0rpx;
				width: 100%;
				font-size: 26rpx;
				color: #808080;
				text-align: center;
			}

			.mask_button {
				width: 80%;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				font-weight: bold;
				text-align: center;
				background: #FFDF2C;
				border-radius: 25rpx;
			}
		}
	}

	.popup_warp {
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
</style>
