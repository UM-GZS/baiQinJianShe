<template>
	<view class="user_tenter_wrap">

		<view class="cover_wrap">
			<image class="cover" :src="user.headpic_url" mode=""></image>
		</view>
		<!-- 操作行 -->
		<view class="user_cell">

			<view class="cell_row">
				<view class="label">用户名称:</view>
				<view class="content">{{ user.uname }}</view>
			</view>
			<view class="cell_row" @click="handelPhone">
				<view class="label">手机号:</view>
				<view class="content">{{ user.phone ? user.phone : '' }}</view>
			</view>
			<!-- 身份 -->
			<view class="cell_row">
				<view class="label" style="line-height: 60rpx;">身份:</view>
				<view class="identity">
					<text style="margin-right: 10rpx;">个人车主</text>
					<image src="../../static/user/success.png" style="width: 25rpx; height: 25rpx;"></image>
				</view>
			</view>

			<u-picker v-model="show_company" mode="selector" :range="company_options" @confirm="companyClick">
			</u-picker>
			<u-picker v-model="user_show" mode="selector" :range="user_options" @confirm="userClick"></u-picker>

			<u-modal v-model="editPhoneShow" show-cancel-button="true" confirm-text="确定" title="完善手机号" 
				@confirm="edituserInfo">
				<view style="padding:40rpx">
					<!-- <input type="number" v-model="phone" placeholder="填写手机号" /> -->

					<u-form :model="form" :rules="rules" ref="uForm"  >
						<u-form-item  prop="phone">
							<u-input type="number" v-model="form.phone"  placeholder="填写手机号" :clearable="false" :focus="editPhoneShow" />
						</u-form-item>
					</u-form>
				</view>
			</u-modal>

		</view>


	</view>
</template>

<script>
	import userApi from "../../network/user/userApi.js"
	export default {
		data() {
			return {
				//! 用户消息对象
				user: null,
				show_company: false,
				user_show: false,
				company_options: ['文员', '技工', '管理', '销售'],
				user_options: ['个人身份1', '个人身份2', '个人身份3', '个人身份4'],
				companyTitle: "身份",
				userTitle: "身份",
				editPhoneShow:false,
				form:{
					phone:''
				},
				rules: {
					phone: [
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change','blur'],
						}
					]
				}

			}
		},
		onShow() {
			//! 获取用户的信息
			let wxuser = getApp().globalData.wxuser;
			if (wxuser) {
				this.userInfo(wxuser.id)
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			//! 获取用户信息函数
			async userInfo(id) {
				const infoRes = await userApi.detail({
					id
				});
				this.user = infoRes.data;
			},
			companyClick(e) {
				let value = this.company_options[e[0]]
				this.companyTitle = value
			},
			userClick(e) {
				let value = this.user_options[e[0]]
				this.userTitle = value
			},
			// 修改用户信息,手机号
			edituserInfo() {
				let that = this
				
				that.$refs.uForm.validate(valid => {
					if (!valid) {
						return
					}
					let query = {
						phone: that.form.phone,
						id: that.user.id
					}
					userApi.editUserInfo(query).then(res => {
						if(res.code==200){
							that.user.phone = that.form.phone
						}
						this.$u.toast(res.msg)
					})
				});

				
			},
			handelPhone(){
				if(this.user.phone){
					return
				}
				this.editPhoneShow = true
			}
		

		},
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		width: 100vw;
	}

	// 头像
	.cover_wrap {
		width: 100%;
		padding: 50rpx 0;
		@include flex-center;

		.cover {
			border-radius: 50%;
			width: 120rpx;
			height: 120rpx
		}
	}

	// 信息
	.user_cell {
		.cell_row {
			padding: 40rpx 50rpx;
			border-bottom: 4rpx solid #e3e3e3;
			display: flex;

			.label {
				font-weight: 600;
				color: #606266;
				padding-right: 30rpx;
				min-width: 150rpx !important;
			}
			.content {
				flex: 1;
				color: #d0d0d0;
			}
			//! 身份
			.identity {
				padding: 10rpx 30rpx;
				@include  flex-center;
				border: 1rpx solid $gray_color;
				background-color: #d8f6f0;
				color: #40e09c;
			}
		}

		/deep/ .u-border-bottom:after,
		.u-border-left:after,
		.u-border-right:after,
		.u-border-top-bottom:after,
		.u-border-top:after,
		.u-border:after {
			border-bottom: 8rpx solid #e3e3e3;
		}

		/deep/ .u-cell_title {
			font-weight: 600;
			color: #606266;
		}
	}
</style>
