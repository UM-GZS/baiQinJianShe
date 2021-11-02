<template>
	<view class="location_wrap">
		<u-index-list :scrollTop="scrollTop">
			<view v-for="(item, index) in city" :key="index">
				<u-index-anchor :index="item.title" />
				<view @click="chooseCity(obj)" class="list-cell" v-for="(obj,objIndex) in item.lists" :key="objIndex">
					{{ obj }}
				</view>
			</view>
		</u-index-list>
	</view>
</template>

<script>
	//! 导入所有城市
	import city from "../../utils/city/city.js";
	export default {
		data() {
			return {
				scrollTop: 0,
				indexList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
					"T", "U",
					"V", "W", "X", "Y", "Z"
				],
				//! 所有地址市的数据
				city
			}
		},
		onLoad() {
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			//! 获取选择的地址
			chooseCity(name) {
				
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}

	.anchor-text {
		color: red;
	}
</style>
