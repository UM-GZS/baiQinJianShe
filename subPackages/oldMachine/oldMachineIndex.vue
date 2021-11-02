<template>
<view>
        <view class="header_wrap">
            <view class="left flex">
                <view>筛选</view>
                <view>
                    <u-icon name="arrow-down-fill" color="#808080"></u-icon>
                </view>
            </view>
            <view class="right">
                <input type="text" placeholder="输入搜索内容" v-model="keyword"> 
                <image src="/static/publicImg/search.png" @click="search" />
            </view>
        </view>

        <view class="list">
			<view class="item" v-for="item in sendList" :key="item.id">
				<view class="left_cover">
					<image src="../../static/index/sw1.jpg"></image>
				</view>
				<view class="right_info">
					<view class="name"><text>最高抵扣200元</text> </view>
					<view class="subtitle">xxxxxxxx</view>
					<view class="price">
						<view>注意事项：xxxxx</view>
						<view @click="clickPhone">电话咨询</view>
					</view>
					<view class="info">￥2000</view>
				</view>
			</view>
		</view>


</view>
</template>

<script>
export default {

    data() {
        return {
            keyword:'',
            sendList: [{},{},{},{}]
        };
    },
    methods: {
        search(){
            console.log(this.keyword);
		},
		clickPhone(){
			console.log(('点击了电话咨询'));
		}

    }
};
</script>

<style scoped lang="scss">
	.flex{
		display: flex;
	}
	.header_wrap{
		display: flex;
		padding: 20rpx 40rpx;
		background-color: #fff;
		.left{
			margin: 10rpx  15rpx 10rpx 30rpx;
			border: 1px solid #999999;
			border-radius: 10rpx;
			padding: 10rpx 20rpx;
			color:#808080;
			height:60rpx;
			width: 150rpx;
		}
		.right{
			flex: 1;
			margin-top: 10rpx;
			position: relative;
			
			input{
				border-radius: 15rpx;
				height:60rpx;
				text-align: center;
				border: 2rpx  solid #999999;
				padding-right: 80rpx;
			}
			image{
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				right: 25rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	.list {
			padding: 22rpx;
			background-color: #fff;
			.item {
				display: flex;
				padding-bottom: 20rpx;
				.left_cover {
					width: 230rpx;
					height: 230rpx;
					@include flex-center;
					padding: 10rpx 10rpx;
					border: 2px  solid #e3e3e3;
					image {
						width: 200rpx;
						height: 200rpx;
					}
				}

				.right_info {
					width: 100%;
					padding: 20rpx 10rpx 0 15rpx;
					position: relative;
					background-color: #fff;

					.name {
						font-size: 28rpx;
						font-weight: 560;
						color: #fff;
						text{
							border-radius: 8rpx;
							padding: 8rpx 15rpx;
							background-color: #ff9d28;
						}
					}

					.subtitle {
						margin-top: 15rpx;
						font-size: 30rpx;
						font-weight: 560;
						color: #888888;
					}

					.price {
						width: 100%;
						margin-top: 15rpx;
						padding-right: 10rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						view:nth-child(1){
							color: #808080;
						}
						view:nth-child(2){
							color: #fff;
							background-color: #ffde2a;
							border-radius: 8rpx;
							padding: 8rpx 15rpx;
						}
					}

					.info {
						position: absolute;
						bottom: 0;
						left: 15rpx;
						color: #000;
						font-weight: 600;
					}
				}
			}
	}


</style>
