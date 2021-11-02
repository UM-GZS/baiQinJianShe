<template>
	<view class="repair_wrap">
		<view class="form">
			<u-form ref="uForm" :rules="rules" :model="form">
				<u-form-item label-width="150" label="姓名" prop="name">
					<u-input placeholder="请输入联系人姓名" v-model="form.name" />
				</u-form-item>
				<u-form-item label-width="150" label="联系电话" prop="phone">
					<u-input placeholder="请输入联系人电话号码" v-model="form.phone" />
				</u-form-item>
				<u-form-item label-width="150" label="设备类型">
					<u-input v-model="typeLabel.label" @click="selectType" placeholder="请选择设备类型" type="select" />
					<!-- <u-select label-name="name" value-name="id" v-model="showDevice" :list="typeList"
						@confirm="confirmType"></u-select> -->
				</u-form-item>
				<u-form-item label-width="150" label="设备品牌">
					<u-input v-model="brandLabel.label" @click="selectBrand" placeholder="请输入设备品牌" type="select" />
					<!-- <u-select label-name="name" value-name="id" v-model="showDeviceBrand" @confirm="confirmBrand"
						:list="brandList"></u-select> -->
				</u-form-item>
				<u-form-item label-width="150" label="设备型号">
					<u-input v-model="modelLabel.label" @click="selectModel" placeholder="请选择设备型号" type="select" />
					<!-- <u-select label-name="name" value-name="id" v-model="showDeviceType" @confirm="confirmModel"
						:list="modelList"></u-select> -->
				</u-form-item>
				<u-form-item label-position="top" label-width="150" label="故障说明:" prop="info">
					<u-input clearable type="textarea" :border="true" height="140" :auto-height="true"
						v-model="form.info" placeholder="请详细说明故障信息和说明,方便维修技师进行沟通" />
				</u-form-item>
				<u-form-item label-position="top" label-width="150" label="附件:请选择正前方、侧方、后方照片上传">
					<u-upload multiple :file-list="fileList" :show-progress="false" ref="uUpload" :action="action"
						:auto-upload="true" @on-remove="onRemove" @on-success="onSuccess"></u-upload>
				</u-form-item>
			</u-form>
		</view>
		<!-- 提交维修订单 -->
		<view class="footer">
			<view class="submit" @click="beforeSubmit">确认提交维修订单</view>
		</view>
		<!-- 设备类型弹窗 -->
		<u-mask :show="showDevice" @click="cancelType">
			<view class="repairSelect">
				<view class="repairRect" @tap.stop>
					<view class="header">
						<view class="left" @click="cancelType">
							取 消
						</view>
						<view class="center">
							请选择设备类型
						</view>
						<view class="right" :class="typeLabel.id ? 'confirmColor' :''" @click.stop="confirmType">
							确 定
						</view>
					</view>
					<!-- 选择数据 -->
					<scroll-view class="repairContent" enable-flex scroll-y>
						<view class="repairContent_item" v-for="(item,index) in typeList" :key="index"
							@click="confirmTypeBefore(item,index)" :class="index === deviceIndex ? 'activeItem' : ''">
							{{ item.name }}
						</view>
					</scroll-view>
				</view>
			</view>
		</u-mask>
		<!-- 设备品牌弹窗 -->
		<u-mask :show="showDeviceBrand" @click="cancelBrand">
			<view class="repairSelect">
				<view class="repairRect" @tap.stop>
					<view class="header">
						<view class="left" @click="cancelBrand">
							取 消
						</view>
						<view class="center">
							请选择品牌类型
						</view>
						<view class="right" :class="brandLabel.id ? 'confirmColor' :''" @click.stop="confirmBrand">
							确 定
						</view>
					</view>
					<!-- 选择数据 -->
					<scroll-view class="repairContent" enable-flex scroll-y>
						<view class="repairContent_item" v-for="(item,index) in brandList" :key="index"
							@click="confirmBrandBefore(item,index)" :class="index === brandIndex ? 'activeItem' : ''">
							{{ item.name }}
						</view>
					</scroll-view>
				</view>
			</view>
		</u-mask>
		<!-- 型号类型 -->
		<u-mask :show="showDeviceType" @click="cancelModel">
			<view class="repairSelect">
				<view class="repairRect" @tap.stop>
					<view class="header">
						<view class="left" @click="cancelModel">
							取 消
						</view>
						<view class="center">
							请选择型号类型
						</view>
						<view class="right" :class="modelLabel.id ? 'confirmColor' :''" @click.stop="confirmModel">
							确 定
						</view>
					</view>
					<!-- 选择数据 -->
					<scroll-view class="repairContent" enable-flex scroll-y>
						<view class="repairContent_item" v-for="(item,index) in modelList" :key="index"
							@click="confirmModelBefore(item,index)" :class="index === typeIndex ? 'activeItem' : ''">
							{{ item.name }}
						</view>
					</scroll-view>
				</view>
			</view>
		</u-mask>
		<!-- 弹窗提示用户确认信息 -->
		<u-mask :show="showConfirm" @click="showConfirm = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="confirm_title">
						确认提交
					</view>
					<view class="confirm_content">
						确认提交维修订单吗?
					</view>
					<view class="confirm" @click="confirm">
						确认
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import repair from '../../network/repair/repair.js';
	export default {
		data() {
			return {
				//! 自动上传图片的地址
				action: '',
				//默认显示的图片列表
				fileList: [],
				//! 设备类型下标
				deviceIndex: null,
				brandIndex: null,
				typeIndex: null,
				//! 控制显示组件
				showDevice: false, // 设备类型
				showDeviceBrand: false, // 设备品牌
				showDeviceType: false, // 设备型号
				// 显示确认弹窗按钮
				showConfirm: false,
				/**
				 * 用于显示选择的名称
				 */
				typeLabel: {
					id: 0,
					label: '',
					name: ''
				},
				brandLabel: {
					id: 0,
					label: '',
					name: ''
				},
				modelLabel: {
					id: 0,
					label: '',
					name: ''
				},
				// 校验规则
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					info: [{
						required: true,
						message: '请填写故障说明',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					]

				},
				/**
				 * 数据列表
				 */
				// 设备类型列表
				typeList: [],
				// 品牌类型列表
				brandList: [],
				// 型号列表
				modelList: [],
				//! 设备维修订单参数
				form: {
					user_id: '', // 用户id
					name: '', // 名称
					phone: '', // 手机号码
					types_id: '', // 设备类型id
					brand_id: '', // 设备品牌id
					model_id: '', // 设备型号id
					info: '', // 维修说明
					urls: [], // 维修设备图片
				}
			}
		},
		onLoad() {
			this.form.user_id = getApp().globalData.wxuser.id
			//! 上传地址
			this.action = getApp().globalData.requesturl + '/api/upload/pic';
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			//! 提交按钮
			beforeSubmit() {
				//! 提交前的判断
				if (!this.form.types_id || !this.form.brand_id || !this.form.model_id) {
					getApp().globalData.global_Toast(true, "请完成设备选择", function(res) {});
					return;
				}
				//! 判断用户是否上传图片
				if (this.form.urls.length < 3) {
					getApp().globalData.global_Toast(true, "请上传设备正前方、侧方、后方照片", function(res) {});
					return;
				}
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						// 显示弹窗
						this.showConfirm = true;
					} else {}
				});
			},
			//! 确认提交
			async confirm() {
				// 解构转换数据
				let form = {
					...this.form,
					urls: JSON.stringify(this.form.urls)
				};
				// 发起提交请求
				const orderRes = await repair.deviceOrder(form);
				// 判断返回的结果是否成功
				if (orderRes.data.id) {
					// 隐藏确认按钮
					this.showConfirm = false;
					// 成功提示
					getApp().globalData.global_Toast(true, "设备维修订单提交成功", (res) => {
						//! 清除数据
						this.clearForm();
					})
				}
			},
			/**
			 * 点击各种类型切换时判断上一个是否已经选择
			 * 品牌类型选择
			 */
			async selectType() {
				let queryInfo = {
					page_num: 1,
					page_size: 9999,
					sort: 'id desc'
				}
				const typeRes = await repair.deviceType(queryInfo);
				this.typeList = typeRes.data.list;
				this.showDevice = true
			},
			//! 选择设备品牌
			async selectBrand() {
				if (!this.form.types_id) {
					getApp().globalData.global_Toast(true, "请完成上一个设备选择", function(res) {});
					return;
				}
				//! 请求数据
				let queryInfo = {
					types_id: this.form.types_id,
					page_num: 1,
					page_size: 999,
					sort: 'id desc'
				};
				const brandRes = await repair.deviceBrand(queryInfo);
				this.brandList = brandRes.data.list;
				this.showDeviceBrand = true;
			},
			// 类型选择
			async selectModel() {
				if (!this.form.types_id || !this.form.brand_id) {
					getApp().globalData.global_Toast(true, "请完成上一个设备选择", function(res) {});
					return;
				}
				let queryInfo = {
					types_id: this.form.types_id,
					brand_id: this.form.brand_id,
					page_num: 1,
					page_size: 999,
					sort: 'id desc'
				}
				const modelRes = await repair.deviceModel(queryInfo);
				this.modelList = modelRes.data.list;
				this.showDeviceType = true;
			},
			// 对应的选中事件
			// 设备类型
			//! 设备类型选择前
			confirmTypeBefore(item, index) {
				console.log("是否打印", item)
				this.deviceIndex = index;
				//! 记录数据
				this.typeLabel.id = item.id;
				this.typeLabel.name = item.name;
			},
			// 设备类型的取消选择
			cancelType() {
				//! 判断用户是否选择数据清除数据
				if (!this.typeLabel.label) {
					this.typeLabel.id = 0;
					this.typeLabel.name = '';
					this.deviceIndex = null;
				}
				this.showDevice = false
			},
			// 品牌选择事件
			confirmType() {
				if (!this.typeLabel.id) {
					return getApp().globalData.global_Toast(true, "请选择设备类型", function(res) {})
				}
				//! 当设备的类型切换后清除之前选中的数据，实现数据的联动
				//! 清除之前的数据用于重新获取
				this.brandLabel.label = '';
				this.modelLabel.label = '';
				//清除下标
				this.brandIndex = null;
				this.typeIndex = null;
				this.form.brand_id = '';
				this.form.types_id = '';
				//! 赋值显示
				this.typeLabel.label = this.typeLabel.name;
				this.form.types_id = this.typeLabel.id;
				this.showDevice = false;
			},
			//!品牌选择前
			confirmBrandBefore(item, index) {
				this.brandIndex = index;
				//! 记录数据
				this.brandLabel.id = item.id;
				this.brandLabel.name = item.name;
			},
			//! 判断用户是否选择设备品牌
			cancelBrand() {
				//! 判断是否选择数据
				if (!this.brandLabel.label) {
					this.brandLabel.id = 0;
					this.brandLabel.name = '';
					this.brandIndex = null;
				}
				this.showDeviceBrand = false;
			},
			// 品牌选择
			confirmBrand() {
				if (!this.brandLabel.id) {
					return getApp().globalData.global_Toast(true, "请选择品牌", function(res) {})
				}
				this.brandLabel.label = this.brandLabel.name;
				this.form.brand_id = this.brandLabel.id;
				
				//! 切换时清除设备型号的选中以及数据
				this.typeIndex = null;
				this.modelLabel.label = '';
				this.form.model_id = '';
				//! 显示弹窗
				this.showDeviceBrand = false;
			},
			//! 型号选择前事件
			confirmModelBefore(item, index) {
				this.typeIndex = index;
				this.modelLabel.id = item.id;
				this.modelLabel.name = item.name;
			},
			cancelModel() {
				if (!this.modelLabel.label) {
					this.modelLabel.id = 0;
					this.modelLabel.name = '';
					this.typeIndex = null;
				}
				this.showDeviceType = false;
			},
			// 型号确定选择事件
			confirmModel(e) {
				if (!this.modelLabel.id) {
					return getApp().globalData.global_Toast(true, "请选择型号", function(res) {})
				}
				this.modelLabel.label = this.modelLabel.name;
				this.form.model_id = this.modelLabel.id;
				this.showDeviceType = false;
			},
			//! 监听图片的上传
			onSuccess(data, index, lists, name) {
				//! 追加数据
				this.form.urls.push({
					img: data.data.url
				})
				this.fileList = lists;
			},
			//! 监听图片的删除函数
			onRemove(index, lists, name) {
				this.form.urls.splice(index, 1)
				this.fileList = lists;
			},
			//! 清除数据
			clearForm() {
				this.form = {
					user_id: getApp().globalData.wxuser.id, // 用户id
					name: '', // 名称
					phone: '', // 手机号码
					types_id: '', // 设备类型id
					brand_id: '', // 设备品牌id
					model_id: '', // 设备型号id
					info: '', // 维修说明
					urls: [] // 维修设备图片
				}
				this.$refs.uUpload.clear();
				//! 清除默认数据
				this.typeLabel = {
					id: 0,
					label: '',
					name: ''
				}
				this.brandLabel = {
					id: 0,
					label: '',
					name: ''
				}
				this.modelLabel = {
					id: 0,
					label: '',
					name: ''
				}
				this.deviceIndex = null
				this.brandIndex = null
				this.typeIndex = null
				this.fileList = [];
			}
		},
	}
</script>

<style lang="scss" scoped>
	.repair_wrap {
		width: 100%;
		height: 100%;

		.form {
			width: 100%;
			padding: 20rpx;
			margin-top: 30rpx;
			background-color: #ffffff;
		}

		.footer {
			margin-top: 30rpx;
			width: 100%;
			padding: 10rpx 30rpx;
			height: 90rpx;
			background-color: #ffffff;

			.submit {
				width: 100%;
				height: 100%;
				@include flex-center;
				font-weight: 800;
				font-size: 30rpx;
				border-radius: 30rpx;
				background-color: $page_color;
			}
		}

		.repairSelect {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			height: 100%;

			.repairRect {
				width: 100%;
				background-color: #ffffff;

				.header {
					width: 100%;
					display: flex;
					padding: 30rpx;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1rpx solid #dddddd;

					.right {
						color: $gray_color;
					}

					.confirmColor {
						color: #f99a08;
					}
				}

				.repairContent {
					margin: 0;
					padding: 30rpx 40rpx;
					width: 100%;
					height: 400rpx;
					box-sizing: border-box;

					.repairContent_item {
						width: 30%;
						margin-right: 3%;
						float: left;
						height: 70rpx;
						padding: 10rpx 10rpx;
						font-weight: 600;
						color: #565656;
						line-height: 50rpx;
						text-align: center;
						border-radius: 15rpx;
						border: 1rpx solid $gray_color;
						margin-bottom: 20rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.activeItem {
						background-color: #f99a08;
						color: #ffffff;
						border: none;
					}
				}
			}
		}

		// 显示确认按钮弹窗
		.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;

			.rect {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 90%;
				border-radius: 20rpx;
				padding: 30rpx;
				background-color: #fff;

				.confirm_title {
					margin-bottom: 30rpx;
					font-size: 35rpx;
					font-weight: 600;
				}

				.confirm_content {
					margin-bottom: 30rpx;
					font-size: 28rpx;
					font-weight: 300;
					letter-spacing: 3rpx;
				}

				// 确认按钮
				.confirm {
					width: 80%;
					padding: 8rpx;
					color: #ffffff;
					@include flex-center;
					border-radius: 6rpx;
					background-color: $page_color;
				}
			}
		}


	}
</style>
