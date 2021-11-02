<template>
	<view>
		<u-cell-group>
			<u-cell-item @click="shoppingRecord" icon="none" title="购买记录" :border-top="false"></u-cell-item>
			<!-- <u-cell-item @click="jodRecord" icon="none" title="求职记录" :border-top="false"></u-cell-item> -->
			<!-- <u-cell-item @click="repairRecord" icon="none" title="维修记录" :border-top="false"></u-cell-item> -->
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			shoppingRecord() {
				uni.navigateTo({
					url:"../../subPackages/user/userCenter/shoppingRecord"
				})
			},
			jodRecord() {
				uni.navigateTo({
					url:"../../subPackages/user/userCenter/jobRecord"
				})
			},
			repairRecord() {
				uni.navigateTo({
					url:"../../subPackages/user/userCenter/repairRecord"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
