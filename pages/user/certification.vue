<template>
	<view class="container">
		<view class="content">
			<view class="input_item flex flex_middle">
				<view class="item_name">当前手机号:</view>
				<input placeholder="请输入手机号码" v-model="phone" type="number" />
			</view>
			<view class="input_item flex flex_middle">
				<view class="item_name">真实姓名:</view>
				<input placeholder="请输入真实姓名" v-model="name" type="text" />
			</view>
		</view>
		<view class="footer flex flex_allcenter">
			<view class="button" @click="submit">提交认证申请</view>
		</view>
	</view>
</template>

<script>
	import userApi from "../../network/user/userApi.js";
	import validity from "../../utils/validate/validity.js";
	export default {
		data() {
			return {
				phone: '',
				name: '',
				userInfo: getApp().globalData.wxuser
			}
		},
		methods: {
			submit() {
				if (!validity.validPhone(this.phone)) {
					return getApp().globalData.global_Toast(true, "请输入正确的手机号码", function(res) {})
				}
				if (!this.name) {
					return getApp().globalData.global_Toast(true, "请输入真实姓名", function(res) {})
				}
				userApi.editUserInfo({
					id: this.userInfo.id,
					rname: this.name,
					phone: this.phone,
					active: 1
				}).then(res => {
					if (res.code === 200) {
						getApp().globalData.global_Toast(true, "提交认证申请成功", function(res) {
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						})
					};
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
	}

	.content {
		margin: 0 auto;
		position: relative;
		top: 20rpx;
		width: 95%;
		height: 200rpx;
		background: #FFFFFF;
	}

	.input_item {
		width: 100%;
		height: 100rpx;
		border: 1px solid #EBEBEB;

		.item_name {
			width: 200rpx;
			text-align: center;
		}

		&>input {
			width: calc(100% - 240rpx);
		}
	}

	.footer {
		width: 100%;
		height: 100rpx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;

		.button {
			width: 600rpx;
			height: 70rpx;
			background: #FFDF2C;
			border-radius: 50rpx;
			text-align: center;
			line-height: 70rpx;
		}
	}
</style>
