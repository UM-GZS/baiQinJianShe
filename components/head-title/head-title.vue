<template>
	<!-- 头部标题 -->
	<view class="comm_title">
		<view class="comm_left">
			<image style="width: 45rpx;height: 45rpx;" :src="img"></image>
			<text style="font-size: 35rpx;margin-left: 10rpx;font-weight: 800;">{{ title }}</text>
		</view>
		<view class="show_more">
			<view style="display: flex;align-items: center;">
				<text style="color: #808080;margin-right: 10rpx;font-size: 25rpx;">更多</text>
				<image src="../../static/index/more.png" style="width: 20rpx;height: 30rpx;"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			title:{
				type:String,
				require:true,
				default:""
			},
			img:{
				type:String,
				required:true,
			}
		}
	}
</script>

<style lang="scss" scoped>
	//！ 公共样式
	.comm_title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.comm_left {
			display: flex;
			align-items: center;
		}
	}
</style>
