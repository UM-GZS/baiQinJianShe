<template>
	<view class="repair_wrap" v-if="!showSuccess">
		<view class="form">
			<u-form ref="uForm" :rules="rules" :model="form">

				<u-form-item label-width="165" label="当前手机号:" prop="phone" :label-style="labelCss">
					<u-input placeholder="请输入当前手机号" v-model="form.phone" />
				</u-form-item>

				<u-form-item label-width="165" label="真实姓名:" prop="name" :label-style="labelCss">
					<u-input placeholder="用户姓名" v-model="form.name" />
				</u-form-item>

				<u-form-item label-width="165" label="身份证号码:" :label-style="labelCss">
					<u-input placeholder="请输入身份证号码" v-model="form.code" />
				</u-form-item>

				<u-form-item label-position="top" label-width="150" label="附件:请上传身份证正反面">
					<u-upload multiple :file-list="fileList" :show-progress="false" ref="uUpload" :action="action"
						:auto-upload="true" @on-remove="onRemove" @on-success="onSuccess"></u-upload>
				</u-form-item>
				<view class="tips">提示：用户进行信息认证后，信息无法进行修改，认证通过后，姓名无法修改</view>
			</u-form>
		</view>
		<!-- 提交维修订单 -->
		<view class="footer">
			<view class="submit" @click="beforeSubmit">提交认证申请</view>
		</view>
		<!-- 弹窗提示用户确认信息 -->
		<u-mask :show="showConfirm" @click="showConfirm = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="confirm_title">
						确认提交
					</view>
					<view class="confirm_content">
						确认提交吗?
					</view>
					<view class="confirm" @click="confirm">
						确认
					</view>
				</view>
			</view>
		</u-mask>
	</view>


	<!-- 审核状态 -->
	<view v-else class="audition_status">
		<view class="status_wrap">
			<!-- 这是身份认证提交成功的状态 -->
			<view class="top_status" v-if="true">
				<u-icon name="checkmark-circle-fill" color="#40e09c" size="84"></u-icon>
				<view>提交成功</view>
			</view>
			<!-- 这是身份认证已经失败的状态 -->
			<view class="top_status" v-else>
				<u-icon name="plus-circle-fill" color="#fd5d3a" size="84" style="transform: rotate(45deg);"></u-icon>
				<view>身份认证失败</view>
			</view>
			<!-- 状态步骤，放入图片即可 -->
			<view class="step">
				<!-- 这里放入状态图片 -->
				<u-steps :list="successList" mode="number" :current="1" activeColor="#40e09c" style="width: 100%;font-size: 18.5rpx;height: 100%;" un-active-color="#808080"></u-steps>
			</view>
			<view class="tips">
				提示：用户进行信息认证后，信息无法进行修改，认证通过后，姓名无法修改
			</view>

		</view>
	</view>

</template>

<script>
	import repair from '../../network/repair/repair.js';
	export default {
		data() {
			return {
				showSuccess:false,
				//! 自动上传图片的地址
				action: '',
				//默认显示的图片列表
				fileList: [],
				//! 控制显示组件
				showDevice: false,
				showDeviceBrand: false,
				showDeviceType: false,
				// 显示确认弹窗按钮
				showConfirm: false,
				/**
				 * 用于显示选择的名称
				 */
				typeLabel: '',
				brandLabel: '',
				modelLabel: '',
				// 成功提交后显示的下标值
				successList:[
					{name:'提交'},
					{name:'身份认证'},
					{name:'等待审核'}
				],
				// 校验规则
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
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
					code: '', // 身份证号
					urls: []
				},
				labelCss: {
					fontWeight: 580,
					color: '#000000'
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
				if (!this.form.phone) {
					getApp().globalData.global_Toast(true, "请填写当前手机号", function(res) {});
					return;
				}
				if (!this.form.name) {
					getApp().globalData.global_Toast(true, "请填写真实姓名", function(res) {});
					return;
				}
				if (!this.form.code) {
					getApp().globalData.global_Toast(true, "请填写身份证信息", function(res) {});
					return;
				}
				//! 判断用户是否上传图片
				if (this.form.urls.length !== 2) {
					getApp().globalData.global_Toast(true, "请上传身份证正反两面照片", function(res) {});
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

				this.showConfirm = false;
				console.log(form);
				
				uni.showToast({
					title: '认证信息待接入',
					duration: 2000
				});

				return
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
					code: '', // 身份证号码
					urls: [] // 维修设备图片
				}
				this.$refs.uUpload.clear();
				this.typeLabel = '';
				this.brandLabel = '';
				this.modelLabel = '';
				this.fileList = [];
			}

		},
	}
</script>

<style lang="scss" scoped>
	.repair_wrap {
		width: 100%;

		.form {
			width: 95%;
			margin: 30rpx auto 0 auto;
			padding: 0 20rpx 110rpx 20rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
		}

		.footer {
			margin-top: 30rpx;
			width: 100%;
			padding: 10rpx 30rpx;
			height: 90rpx;
			background-color: #ffffff;
			position: fixed;
			bottom: 0;


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

		.tips {
			font-size: 20rpx;
			color: #808080;
		}


	}

	// 身份认证的审核状态
	.audition_status {
		background-color: #fff;
		margin: 25rpx;
		// height: 520rpx;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;

		.status_wrap {
			display: flex;
			flex-direction: column;

			.top_status {
				text-align: center;
				font-size: 37rpx;
				color: #000;
				margin-top: 80rpx;
			}

			.step {
				margin: 50rpx 0 30rpx 0;
				padding: 23rpx  0;
				border: 1px solid #e3e3e3;
				border-radius: 15rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.tips {
				margin-top: 30rpx;
				color: #808080;
				font-size: 20rpx;
			}
		}
	}
</style>
