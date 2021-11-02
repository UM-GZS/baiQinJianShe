<template>
	<view>

		<view class="list">
			<view class="label">企业认证</view>
			<view class="sub_label">企业单位认证资源资源资源资源资源</view>

			<u-cell-group class="cell_wrap">
				<u-cell-item title="工程方入驻" :title-style="labelCss"></u-cell-item>
				<u-cell-item title="企业车主入驻" :title-style="labelCss"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="list">
			<view class="label">个人认证</view>
			<view class="sub_label">个人认证类型认证资源资源资源资源资源</view>

			<u-cell-group class="cell_wrap">
				<u-cell-item title="个人认证" :title-style="labelCss" @click="goPersonalProve"></u-cell-item>
				<u-cell-item title="个人车主认证" :title-style="labelCss"></u-cell-item>
				<u-cell-item title="个人司机认证" :title-style="labelCss"></u-cell-item>
			</u-cell-group>
		</view>




	</view>
</template>

<script>
	export default {
		data() {
			return {
				labelCss: {
					fontSize: '34rpx',
					color: '#38393B'
				}
			};
		},
		methods: {
			// 去个人认证
			goPersonalProve(){
				uni.redirectTo({
					 url: '../user/personalProve'
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.list {
		padding: 20rpx 0;

		.label {
			font-size: 44rpx;
			color: #000;
			font-weight: 600;
			margin-top: 10rpx;
			padding: 0 30rpx;
		}

		.sub_label {
			color: #808080;
			font-size: 32rpx;
			margin-top: 20rpx;
			padding: 0 30rpx;
			margin-bottom: 20rpx;
		}

		.cell_wrap {}




	}
</style>
