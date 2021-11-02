<template>
	<view class="headerSearchs">
		<view class="left_loc" @click="chooseLoc">
			<u-icon name="map" size="40"></u-icon>
			<text class="location">{{ location }}</text>
		</view>
		<view class="center_input" @click="goSearch">
			<u-search :show-action="false" input-align="center" height="65" placeholder="输入内容搜索" disabled></u-search>
		</view>
		<view class="scan">
			<u-icon name="scan" size="60"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			location: {
				type: String,
				default: '正在获取'
			},
		},
		data() {
			return {
			}
		},
		methods: {
			chooseLoc() {
				this.$emit("clickLoc")
			},
			// 跳转搜索界面
			goSearch() {
				uni.navigateTo({
					url:"../../subPackages/search/search"
				})
			}
		},
		watch: {
			location:{
				handler(newValue,oldValue) {
					this.location = newValue;
				},
				deep:true
			}
		},
	}
</script>

<style lang="scss" scoped>
		
	.headerSearchs {
		position: sticky;
		top: 0;
		left: 0;
		z-index:8888;
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		background-color: #ffffff;
		padding: 30rpx;
		align-items: center;
		// color: #ffffff;
		.center_input {
			flex: 1;
			margin: 0 20rpx ;
		}
		.left_loc {
			display: flex;
			justify-content: center;
			align-items: center;
			.location {
				margin-left: 10rpx;
			}
		}
	}
</style>
