<template>
	<view>
		<view class="add_btn">
			<view @click="addCar">添加</view>
		</view>

		<view class="list">
			<view class="item" v-for="item in vehicleList" :key="item.id">
				<view class="left">
					<u-image width="60rpx" height="55rpx" src="/static/index/vehicle_trading.png" />
					<view>{{ item.model }} - {{ item.number }}</view>
				</view>
				<view class="right" @click="editInfo(item.id)">
					编辑
				</view>
			</view>
		</view>

		<u-popup v-model="show" class="popup_wrap" mode="center" width="90%" height="680rpx" closeable
			close-icon-pos="top-right" close-icon-size="36" border-radius="20" close-icon-color="#000">
			<view class="title">编辑车辆</view>

			<view class="content">
				<view class="left_label">
					<u-image src="/static/index/vehicle_trading.png" width="50rpx" height="50rpx" />
					<view>厂家型号:</view>
				</view>
				<view class="right_info">
					<u-input v-model="form.model" type="text" border placeholder="请输入厂家型号" :clearable="false"
						input-align="center" />
				</view>
			</view>

			<view class="content">
				<view class="left_label">
					<u-image src="/static/index/vehicle_trading.png" width="50rpx" height="50rpx" />
					<view>车牌号:</view>
				</view>
				<view class="right_info">
					<u-input v-model="form.number" type="text" border placeholder="请输入车牌号" :clearable="false"
						input-align="center" />
				</view>
			</view>

			<view class="content">
				<view class="left_label">
					<u-image src="/static/index/vehicle_trading.png" width="50rpx" height="50rpx" />
					<view>购买时间:</view>
				</view>
				<view class="right_info">
					<u-input v-model="form.purchase_time" type="select" border placeholder="请选择时间" input-align="center"
						@click="buyTimeShow=true" />
				</view>
			</view>

			<view class="content">
				<view class="left_label">
					<u-image src="/static/index/vehicle_trading.png" width="50rpx" height="50rpx"
						input-align="center" />
					<view>保养时间:</view>
				</view>
				<view class="right_info">
					<u-input v-model="form.maintenance_time" type="select" border placeholder="请选择时间"
						input-align="center" @click="upkeepTimeShow=true" />
				</view>
			</view>

			<view class="btn_ctrl">
				<view class="text" v-if="type === 0" @click="submit">修改</view>
				<view class="text" v-else @click="submit">添加</view>
			</view>

		</u-popup>

		<u-picker v-model="buyTimeShow" mode="time" :params="params" @confirm="handelBuyTime"></u-picker>
		<u-picker v-model="upkeepTimeShow" mode="time" :params="params" @confirm="handelUpkeepTime"> </u-picker>


	</view>
</template>

<script>
	import carApi from '../../network/user/car.js';
	import validApi from '../../utils/validate/validity.js';
	export default {
		data() {
			return {
				//! 判断类型修改还是添加 0表示修改 1表示添加
				type: 0,
				vehicleList: [],
				show: false,
				form: {
					user_id: getApp().globalData.wxuser.id, // 用户id
					model: '', // 厂家型号
					number: '', // 车牌号码
					purchase_time: '', // 购买时间
					maintenance_time: '' // 保养时间
				},
				itemId: -1, // 记录当前选择的id
				buyTimeShow: false, // 购买时间
				upkeepTimeShow: false, // 保养时间
				// 时间选择控件的年月日时分秒属性
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				//! 请求参数
				queryInfo: {
					user_id: getApp().globalData.wxuser.id,
					page_num: 1,
					page_size: 999,
					sort: 'id desc'
				}
			};
		},
		onLoad() {
			this.getList()
		},
		methods: {
			// 获取车辆列表
			async getList() {
				const res = await carApi.carList(this.queryInfo);
				this.vehicleList = res.data.list;
			},
			// 修改车辆
			async editInfo(id) {
				this.type = 0; // 显示修改
				const res = await carApi.getCarById({
					id
				});
				// this.itemId = id
				this.form = {
					...res.data,
					purchase_time: getApp().globalData.formatDate1(res.data.purchase_time),
					maintenance_time: getApp().globalData.formatDate1(res.data.maintenance_time)
				};
				this.show = true
			},
			// 添加车辆弹窗
			addCar() {
				this.clearData();
				this.type = 1;
				this.show = true;
			},
			submit() {
				let data = this.form
				if (!data.model) {
					this.$u.toast("请输入厂家型号")
					return
				}
				if (!data.carNum && !validApi.validCar(this.form.number)) {
					this.$u.toast("请输入正确的车牌号码")
					return
				}
				if (!data.purchase_time) {
					this.$u.toast("请选择购买时间")
					return
				}
				if (!data.maintenance_time) {
					this.$u.toast("请选择保养时间")
					return
				}
				//! 根据当前的type去判断是修改的还是添加
				// 表示修改
				if (this.type === 0) {
					let params = this.networkParams();
					carApi.updateCar(params).then(res => {
						getApp().globalData.global_Toast(true,"修改车辆成功",function(res){});
					})
				}else if(this.type === 1) {
					let params = this.networkParams();
					carApi.addCar(params).then(res => {
						getApp().globalData.global_Toast(true,"添加车辆成功",function(res){});
					})
				}
				//!重新请求数据
				this.clearData();
				this.getList();
				this.show = false;
			},
			//  过滤返回请求参数
			networkParams() {
				let data = {
					...this.form,
					purchase_time:this.get_unix_time_stamp(this.form.purchase_time),
					maintenance_time:this.get_unix_time_stamp(this.form.maintenance_time)
				}
				return data;
			},
			// 普通时期转成时间戳
			get_unix_time_stamp(strtime = false) {
				if (strtime) {
					var date = new Date(strtime);
				} else {
					var date = new Date();
				}
				let time1 = date.getTime(); //会精确到毫秒---长度为13位
				//time2 = date.valueOf(); //会精确到毫秒---长度为13位
				//time3 = Date.parse(date); //只能精确到秒，毫秒将用0来代替---长度为10位
				return time1;
			},

			handelBuyTime(e) {
				this.form.purchase_time = e.year + "-" + e.month + "-" + e.day
			},
			handelUpkeepTime(e) {
				this.form.maintenance_time = e.year + "-" + e.month + "-" + e.day
			},
			// 清除默认数据
			clearData() {
				this.form = {
					user_id: getApp().globalData.wxuser.id, // 用户id
					model: '', // 厂家型号
					number: '', // 车牌号码
					purchase_time: '', // 购买时间
					maintenance_time: '' // 保养时间
				}
				this.queryInfo = {
					user_id: getApp().globalData.wxuser.id,
					page_num: 1,
					page_size: 999,
					sort: 'id desc'
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.add_btn {
		width: 100%;
		background-color: #fff;
		@include flex-center;
		border-bottom: 2rpx solid #cccccc;
		padding: 30rpx 0;

		view {
			width: 150rpx;
			padding: 7rpx 0;
			background-color: $page_color;
			text-align: center;
			border-radius: 5rpx;
			color: #fff;
		}
	}

	.list {
		background-color: #fff;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 30rpx 30rpx 30rpx;
			border-bottom: 2rpx solid #cccccc;

			.left {
				display: flex;
				align-items: center;

				view {
					margin-left: 20rpx;
					color: #000;
					font-weight: 600;
					font-size: 30rpx;
				}
			}

			.right {
				padding: 8rpx 20rpx;
				background-color: #cccccc;
				border-radius: 10rpx;
				color: #FFFFFF;
			}
		}
	}

	.popup_wrap {
		.title {
			width: 100%;
			text-align: center;
			font-size: 34rpx;
			font-weight: 600;
			padding: 50rpx 0 40rpx 0;
		}

		.content {
			display: flex;
			align-items: center;
			margin: 15rpx 40rpx;
			padding-left: 10rpx;
			justify-content: space-between;

			.left_label {
				display: flex;
				align-items: center;

				view {
					font-size: 28rpx;
					color: #000;
					margin-left: 15rpx;
				}
			}

			.right_info {
				width: 340rpx !important;
			}

		}

		.btn_ctrl {
			margin-top: 20rpx;
			height: 150rpx;
			width: 100%;
			@include flex-center;
			background-color: #fff;

			.text {
				width: 80%;
				background-color: $page_color;
				@include flex-center;
				font-size: 34rpx;
				padding: 10rpx 0;
				font-weight: 600;
				color: #ffffff;
				border-radius: 15rpx;
			}
		}



	}
</style>
