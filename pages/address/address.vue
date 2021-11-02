<template>
	<view class="container">
		<view v-if="addressList.length>0">
			<view v-for="(item,index) in addressList"   class="address_list" 
				:key="index"
				@click="clickAddressItem(item)">
				<view class="address_item">
					<view class="address_label">收货人名字:</view>
					<view class="address_content">{{item.name}}</view>
				</view>
				<view class="address_item">
					<view class="address_label">收货人电话:</view>
					<view class="address_content">{{item.phone}}</view>
				</view>
				<view class="address_item">
					<view class="address_label">收货人地址:</view>
					<view class="address_area">{{item.region+item.detail}}</view>
				</view>
				<view class="btn_ctrl">
					<view class="btn_default" @click.stop="openSetDefault(item.id,item.def)">
						<u-icon name="checkmark-circle-fill" color="#fddf2f" size="40" v-if="item.def"></u-icon>
						<view class="circle" v-else></view>
						<text :class="item.def?'active':''">设为默认</text>
					</view>
					<view class="del_edit">
						<text  @click.stop="openDelete(item.id)">删除</text>
						<text @click.stop="openEdit(item)">修改</text>
					</view>
				</view>
			</view>
		</view>

		<view v-else class="none-data">
			<u-empty text="收货地址为空" mode="address"></u-empty>
		</view>

		<view class="bottom" @click="addAddress">
			<image src="../../static/user/add.png" class="add_icon"></image>
			添加收货地址
		</view>

		<u-popup v-model="showAdd" mode="center" border-radius="10" width="650rpx" height="340px" class="dialog_wrap" @close="closePopup">
			<view class="label">添加收货地址</view>
			<view class="cell_row">
				<text>收货人:</text>
				<input class="content" type="text" placeholder="请输入收货人名称"   v-model="addData.userName" />
			</view>
			<view class="cell_row">
				<text>联系电话:</text>
				<input class="content" type="text" placeholder="请输入收货人联系电话"   v-model="addData.userPhone" />
			</view>
			<view class="cell_row" @click="selectAddress">
				<text>选择地区:</text>
				<text class="select_address">{{addData.address}}</text>
				<u-icon name="arrow-right" size="30" class="arrow"></u-icon>
			</view>
			<view class="cell_row">
				<text>详细地址:</text>
				<!-- <text class="select_address">{{addData.detail}}</text> -->
				<input class="content" type="text" placeholder="填写详细地址"  v-model="addData.userDetail"  />
				<view class="position" @click="clickPosition">
					<image src="../../static/user/address_position.png"></image>
					<view>定位</view>
				</view>
			</view>
			<view class="default_set">
				<u-checkbox v-model="addData.isDefault" shape="circle">设为默认</u-checkbox>
			</view>
			<view class="save_btn" @click="addSubmit">
				<view class="btn" hover-class="save_hover">保存</view>
			</view>
		</u-popup>
		

		<u-picker mode="region" v-model="addressShow" :area-code='["11", "1101", "110101"]' @confirm="confirmAddress">
		</u-picker>


	</view>
</template>

<script>
	import addressApi from "../../network/user/addressApi.js";
	let QQMapWX = require('../../utils/map/qqmap-wx-jssdk.js');
	let qqmapsdk;
	export default {
		data() {
			return {
				addressList: [],
				showAdd: false,
				addressShow: false, // 选择地区控件显示
				addData: {
					userName: "",
					userPhone: "",
					address: "",
					userDetail: "",
					isDefault: false
				},
				type: '', //页面类型
				wxuser: {},
				edit_add:"",
				itemId:"",
			}
		},
		onLoad(options) {
			this.type = options.type
			this.wxuser = uni.getStorageSync('wxuser')
			this.getList()
			qqmapsdk = new QQMapWX({
				key: getApp().globalData.tx_map_key
			});
		},
		methods: {
			getList() {
				let query = {
					user_id: this.wxuser.id,
					page: 1,
					pageSize: 99
				}
				addressApi.getAddressList(query).then(res => {
					this.addressList = res.data.list
				})
			},
			// 添加地址模态框
			addAddress() {
				this.edit_add = 'add'
				this.showAdd = true
			},
			// 点击定位
			clickPosition() {
				let _this = this;
				uni.chooseLocation({
					success:function(res){
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success: function(addressRes) {
								let {province,city,district} = addressRes.result.address_component
								_this.addData.address = province+city+district
							}
						})

						if(res.name && res.address) {
							_this.addData.userDetail = res.name;
						}
					}
				})
			},
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
								console.log(addressRes);
								
								// _this.location = addressRes.result.ad_info;
								// _this.locName = addressRes.result.ad_info.city;
							}
						})
					},
					fail: function(err) {
						//! 说明用户拒绝了首次的获取地理位置
						_this.locName = "获取失败";
					}
				})
			},
			// 添加时的选择地址打开
			selectAddress() {
				this.addressShow = true
			},
			// 拿取选择的地址
			confirmAddress(e) {
				this.addData.address = e.province.label + e.city.label + e.area.label
			},
			// 地址弹出层的提交
			addSubmit() {
				let that = this
				if(!that.addData.userName){
					that.$u.toast('请填写收货名称');
					return
				}
				if(!that.addData.userPhone){
					that.$u.toast('请填写联系电话');
					return
				}
				if(!that.addData.address){
					that.$u.toast('请选择地址');
					return
				}
				if(!that.addData.userDetail){
					that.$u.toast('请填写详细地址');
					return
				}
				
				if(this.edit_add=='add'){
					let query = {
						user_id: that.wxuser.id,
						name: that.addData.userName,
						phone: that.addData.userPhone,
						region: that.addData.address,
						detail: that.addData.userDetail,
						def: that.addData.isDefault
					}
					addressApi.addAddress(query).then(res => {
						that.$u.toast(res.msg);
						that.showAdd = false
						that.getList()
					})
				}else{
					let query = {
						id:this.itemId,
						user_id: that.wxuser.id,
						name: that.addData.userName,
						phone: that.addData.userPhone,
						region: that.addData.address,
						detail: that.addData.userDetail,
						def: that.addData.isDefault
					}
					addressApi.editAddress(query).then(res => {
						that.$u.toast(res.msg);
						that.showAdd = false
						that.getList()
					})
				}
			},
			openSetDefault(id,def) {
				if(def){
					uni.showModal({
						title: '温馨提示',
						content: "此地址已经是默认地址！",
						showCancel: false,
					});
					return
				}
				
				let that = this
				uni.showModal({
					title: '设为默认',
					content: "是否设为默认地址?",
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							that.setDefault(id)
						}
					}
				});
			},
			// 首页设为默认,api
			setDefault(id) {
				let that = this
				let query = {
					id,
					user_id: that.wxuser.id,
					def: true
				}
				addressApi.editAddress(query).then(res => {
					that.$u.toast(res.msg);
					that.getList()
					that.showAdd = false
				}).catch(err=>{
					that.$u.toast(err.msg);
				})
			},
			openDelete(id){
				let that = this
				uni.showModal({
					title: '设为删除',
					content: "是否删除地址?",
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							that.delete(id)
						}
					}
				});
			},
			delete(id){
				let that = this
				let query = {
					id
				}
				addressApi.deleteAddress(query).then(res => {
					that.$u.toast(res.msg);
					that.getList()
				}).catch(err=>{
					that.$u.toast(err.msg);
				})
			},
			// 点击地址项
			clickAddressItem(item) {
				// 将用户选择的地址存储到vuex中
				this.$store.commit('chooseAddress',item);
				//! 如果界面非订单界面跳转的收货地址不执行后面
				if (this.type == '') {
					return
				}
				uni.navigateBack({
				    delta: 1
				});
			},
			openEdit(data){
				this.edit_add = 'edit'
				this.itemId = data.id
				this.addData =  {
					userName: data.name,
					userPhone: data.phone,
					address: data.region,
					userDetail: data.detail,
					isDefault: data.def,
				}
				this.showAdd = true
			},
			closePopup(){
				this.addData = {
					userName: "",
					userPhone: "",
					address: "",
					userDetail: "",
					isDefault: false
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.container {

		// 列表
		.address_list {
			background-color: #FFFFFF;
			padding: 30rpx 80rpx 100rpx 80rpx;
			border-bottom: 3rpx solid #e3e3e3;

			.address_item {
				display: flex;
				margin: 20rpx 0;

				.address_label {
					width: 190rpx;
					font-size: 30rpx;
					font-weight: bold;
					color: #808080;
				}

				.address_area {
					flex: 1;
				}
			}

			// 按钮
			.btn_ctrl {
				@include flex-jcsb;

				.btn_default {
					display: flex;
					align-items: center;
				}

				.del_edit {
					text {
						padding-left: 10rpx;
						margin-left: 5rpx;
					}
				}

				.circle {
					width: 40rpx;
					height: 40rpx;
					background-color: #FFFFFF;
					border-radius: 50%;
					border: 1px solid #e3e3e3;
					margin-right: 15rpx;
				}

				.active {
					color: $page_color;
				}
			}
		}

		// 底部按钮
		.bottom {
			position: fixed;
			bottom: 0;
			width: 100%;
			background-color: $page_color;
			height: 90rpx;
			@include flex-center;

			.add_icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 18rpx;
			}
		}

		// 添加收货地址
		.dialog_wrap {
			padding: 20rpx;
			position: relative;

			.label {
				text-align: center;
				font-size: 30rpx;
				font-weight: 700;
				padding-top: 30rpx;
			}

			.cell_row {
				padding: 40rpx 50rpx 20rpx 50rpx;
				border-bottom: 4rpx solid #e3e3e3;
				display: flex;
				align-items: center;
				position: relative;

				text {
					font-size: 26rpx;
					color: #808080;
					width: 150rpx;
				}

				.arrow {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-30%);
				}

				.select_address {
					padding-right: 20rpx;
					flex: 1;
					display: flex;
					flex-wrap: wrap;
				}

				.position {
					position: absolute;
					right: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 80rpx;

					image {
						width: 40rpx;
						height: 30rpx;
					}
				}
			}

			.default_set {
				display: flex;
				justify-content: flex-end;
				margin-top: 20rpx;
				margin-bottom: 10rpx;
			}

			.save_btn {
				width: 100%;
				@include flex-center;
				position: absolute;
				bottom: 30rpx;

				.btn {
					padding: 10rpx 0;
					width: 60%;
					height: 100%;
					background-color: $page_color;
					text-align: center;
					color: #FFFFFF;
					border-radius: 10rpx;
				}

				.save_hover {
					background-color: #fde66f;
				}
			}
		}

		.none-data {
			position: fixed;
			top: 30%;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
