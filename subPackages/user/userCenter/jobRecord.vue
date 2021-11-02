<template>
	<view class="job_record">
		<view class="record_list" v-if="myList.length > 0">
			<view class="record_item" v-for="(item,index) in myList" :key="index">
				<view class="left_img">
					<image :src="baseUrl + JSON.parse(item.urls)[0].img" style="width: 100%;height: 100%;"></image>
				</view>
				<view class="right_info">
					<view class="name">{{item.uname}}</view>
					<view class="subtitle">{{item.status_name}}</view>
					<view class="price">{{item.salary}}</view>
					<view class="info">{{item.address}} | {{item.gender_name}} | {{item.post}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import jobApi from "../../../network/job/jobApi.js"
	export default {
		data() {
			return {
				baseUrl:'',
				myList:[],
				query:{
					user_id:getApp().globalData.wxuser.id,
					gender:getApp().globalData.wxuser.gender,
					page_num: 1,
					page_size: 20,
					sort:'id desc'
				},
			}
		},
		onLoad() {
			this.baseUrl = getApp().globalData.requesturl;
			this.getMyList();
		},
		methods: {
			// 获取求职记录
			getMyList() {
				jobApi.listJob(this.query).then(res=>{
					this.myList = res.data.list
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.job_record {
		width: 100%;
		.record_list {
			width: 100%;
			.record_item {
				width: 100%;
				margin-bottom: 20rpx;
				padding: 30rpx 20rpx;
				background-color: #ffffff;
				display: flex;
				.left_img {
					width: 210rpx;
					height: 210rpx;
					border: 1rpx solid $gray_color;
				}
				.right_info {
					flex: 1;
					padding: 0 10rpx 0 15rpx;
					position: relative;
				
					.name {
						font-size: 34rpx;
						font-weight: 560;
						color: #38393b;
					}
				
					.subtitle {
						margin-top: 20rpx;
						font-size: 28rpx;
						font-weight: 560;
						color: #888888;
					}
				
					.price {
						width: 100%;
						font-weight: 560;
						text-align: right;
						color: #ffdf2c;
						padding-right: 10rpx;
					}
				
					.info {
						width: 100%;
						position: absolute;
						bottom: 0;
						left: 15rpx;
					}
				}
			}
		}
	}
</style>
