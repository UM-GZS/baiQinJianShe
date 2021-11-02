<template>
	<view>
		<view class="none_data" :style="{height:height}">
			<u-empty :text="text" :mode="mode"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				require: false,
				default: "暂无数据"
			},
			mode: {
				// uview上的空数据类型
				type: String,
				required: false,
				default: "data"
			},
			height: {
				type: String,
				required: false,
				default: "100%"
			}
		},

		data() {
			return {

			};
		},
		methods: {

		}
	};
</script>

<style scoped lang="css">
	/* .none_data{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #000;
} */

	.none_data {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
