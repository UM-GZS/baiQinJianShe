<template>
	<view class="repair_wrap">
		<view class="form">
			<view class="title">
					<u-field v-model="formData.title" placeholder="编辑发布商品标题" 
					type="textarea"
							label-width="0" focus 
							class="heade_area"
							:border-bottom="false"
							:field-style="inputCssObj"
							placeholder-style="color:#000;font-weight:600;font-size:34rpx;"
					></u-field>
			</view>
			<view class="detail">
				<u-field v-model="formData.detail" placeholder="编辑宝贝转手原因，入手渠道等基本信息" type="textarea"
						label-width="0" class="detail_inpit"
						placeholder-style="color:#808080;font-size:30rpx"
				></u-field>
			</view>
			<u-form-item label-position="top" label-width="150" >
				<u-upload multiple :file-list="fileList" :show-progress="false" ref="uUpload" :action="action"
					:auto-upload="true" @on-remove="onRemove" @on-success="onSuccess"></u-upload>
			</u-form-item>
			
			<u-cell-group>
				<u-cell-item  title="宝贝价格" arrow-direction="right" :value="showPrice"  @click="priceShow=true">
				</u-cell-item>
				<u-cell-item  title="我的身份"  :arrow="false">
					<view class="flex cell" slot="right-icon">
						<u-radio-group v-model="formData.radioValue" class="flex" v-for="(item,index) in redioList" :key="index">
							<view class="radio_list" @click.stop="radio_select(item,index)" :class="item.name==formData.radioValue?'active':''">
								<text>{{item.name}}</text>
									<u-radio :label-disabled="false" :name="item.name" shape="circle" active-color="#40e09c"
										@change="radioChange" 
										></u-radio>
							</view>
						</u-radio-group>
					</view>
				</u-cell-item>
				
				<u-cell-item  title="个人信息" arrow-direction="right"  @click="userInfoShow=true" :value="userInfo">
				</u-cell-item>
				
				<u-cell-item  title="位置信息" arrow-direction="right" :value="formData.address" @click="addressShow=true">
				</u-cell-item>
			</u-cell-group>

		</view>
		<!-- 提交维修订单 -->
		<view class="footer">
			<view class="submit" @click="submit">确认发布</view>
		</view>
		
		<u-picker mode="region" v-model="addressShow" :area-code='["11", "1101", "110101"]' @confirm="fonfirmAddress">
		</u-picker>


		<u-popup v-model="priceShow" mode='center' width="90%" height="500" border-radius="20" class="model_wrap">
			<view class="title">宝贝价格</view>
			<u-radio-group v-model="formData.priceSelect" class="flex model_list"  >
				<view class="radio_list  price_self"  style="margin-top:30rpx;width:70vw !important;" >
					<u-radio name="定价" shape="circle" active-color="#40e09c" class="price_label"
						@change="radioChange" 
						>定价</u-radio>
					<input  placeholder="请输入价格" v-model="priceSelf" type="number" class="price_input"/>
				</view>
				<view class="radio_list"  style="margin-top:30rpx" >
					<u-radio name="面议" shape="circle" active-color="#40e09c"
						@change="radioChange" 
						>面议</u-radio>
				</view>
			</u-radio-group>
			<view class="btn_ctrl">
				<view @click.stop="handelPrice">确认</view>
			</view>

		</u-popup>



		<u-popup v-model="userInfoShow" mode='center' width="90%" height="520" border-radius="20"  >
			<view class="info_wrap"> 
				<view class="title">个人信息</view>
				<u-form :model="formData" label-width="150rpx" :rules="rules" ref="uForm"  class="info_form">

					<u-form-item label="姓名" prop="name">
						<u-input  placeholder="请输入姓名" v-model="formData.name" type="text"  maxlength="20"  />
					</u-form-item>

					<u-form-item label="联系方式" prop="phone">
						<u-input v-model="formData.phone"  placeholder="请输入联系电话"  />
					</u-form-item>
				</u-form>

				<view class="btn_ctrl">
					<view @click.stop="confirmModelValid">确认</view>
				</view>
			</view>
		</u-popup>


			

		<!-- <u-modal :v-model="false" title="个人信息" class="model_wrap" title-style="modelTitle" @confirm="confirmModel">
			<u-radio-group v-model="formData.priceSelect" class="flex model_list" style="width:100%" >
				<view class="radio_list flex price_self"  style="margin-top:30rpx;padding-top:30rpx;" >
					<view>姓名</view>
					<input  placeholder="请输入姓名" v-model="formData.name" type="text"  maxlength="20"  />
				</view>
				<view class="radio_list flex price_self"  style="margin-top:40rpx;padding-bottom:30rpx;"  >
					<view>联系方式</view>
					<input  placeholder="请输入联系方式" v-model="formData.phone" type="number" maxlength="11" />
				</view>
				
			</u-radio-group>
			
		</u-modal> -->
		
		
		
	</view>
</template>

<script>
	import API from "../../network/secondHand/secondHand"
	export default {
		data() {
			return {
				//! 自动上传图片的地址
				action: '',
				//默认显示的图片列表
				fileList: [],
				//! 控制显示组件
				showDevice:false,
				showDeviceBrand:false,
				showDeviceType:false,
				formData:{
					title:"",
					detail:"",
					radioValue:"个人",
					address:"",
					priceSelect:"定价",
					name:'',
					phone:''
				},
				// 商品标题的输入框样式
				inputCssObj:{
					color:'#000',
					fontWeight:'600',
					fontSize:'34rpx',
					'borderBottom':"2rpx solid #e3e3e3",
				},
				redioList:[
					{
						name:"个人",
					},{
						name:"商家",
					},
				],
				addressShow: false, // 选择地区控件显示
				priceShow: false, // 选择价格/面议控件显示
				priceSelf:"",
				modelTitle:{
					fontSize:"30rpx",
					fontWeight:600,
				},
				showPrice:'',
				userInfoShow:false,
				
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					]

				},
				


			}
		},
		onLoad() {
			//! 上传地址
			this.action = getApp().globalData.requesturl + '/api/upload/pic';
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		computed:{
			userInfo(){
				if(this.formData.name.length>=1&&this.formData.phone.length){
					return this.formData.name+'--'+this.formData.phone
				}else{
					return this.formData.name+this.formData.phone
				}
			}
		},
		methods: {
			//! 监听图片的上传
			onSuccess(data, index, lists, name) {
				//! 追加数据
				this.fileList = lists;
			},
			//! 监听图片的删除函数
			onRemove(index, lists, name) {
				this.fileList = lists;
			},
			radioChange(e){
				// console.log(e)
			},
			radio_select(item,index) {
				this.formData.radioValue = item.name;
			},
			//! 提交
			submit(){
				let data = this.formData
				if(!data.title){
					this.$u.toast("请填写标题名称")
					return
				}
				if(!data.detail){
					this.$u.toast("请填写发布详情信息")
					return
				}
				if(this.fileList.length==0){
					this.$u.toast("请至少选择一张图片")
					return
				}
				if(!data.name){
					this.$u.toast("请填写发布者姓名")
					return
				}
				if(!this.showPrice){
					this.$u.toast("请填写商品宝贝价格或者选择面议")
					return
				}
				if(!data.phone){
					this.$u.toast("请填写发布者联系电话")
					return
				}
				if(!data.address){
					this.$u.toast("请选择地址位置信息")
					return
				}

				let imgs = []
				this.fileList.forEach(el => {
					imgs.push({
						img:el.response.data.url
					})
				});
				let smallImg = imgs[0].img
				imgs = JSON.stringify(imgs)
				// 个人或商家
				let personType = ''
				if(data.radioValue=='个人'){
					personType = 0
				}else{
					personType = 1
				}

				let query = {
					user_id:getApp().globalData.wxuser.id,
					personType,
					name:data.title,
					info:data.detail,
					position:data.address,
					user_name:getApp().globalData.wxuser.uname,
					phone:data.phone,
					img_urls:imgs,
					price:this.showPrice,
					small_img_urls:smallImg
				}
				
				
				API.add(query).then(res=>{
					this.$u.toast(res.msg)
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});

					}, 1200);
					
				})
				
			},
			fonfirmAddress(e) {
				this.formData.address = e.province.label + e.city.label + e.area.label
			},
			confirmModel(){
				let price = '';
				if(this.formData.priceSelect=='定价'){
					price = this.priceSelf
				}else{
					price = '面议'
				}
				this.showPrice = price
			},
			// 价格点击
			handelPrice(){
				let price = '';
				if(this.formData.priceSelect=='定价'){
					

					if(this.priceSelf==''){
						uni.showToast({
							title: '定价选择请填写价格',
							position:'bottom',
							duration: 2000,
							icon:"none",
							mask:true,
						});
						return
					}

					price = this.priceSelf
				}else{
					price = '面议'
				}
				this.showPrice = price
				this.priceShow = false
			},
			confirmModelValid() {
				let that =this
				that.$refs.uForm.validate(valid => {
					if (valid) {
						that.userInfoShow = false
					} else {
					}
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	
	.repair_wrap {
		width: 100%;
		height: 100%;
		.form {
			width: 100%;
			background-color: #ffffff;
			padding: 18rpx 10rpx 90rpx 10rpx;
			.title {
				/deep/ .u-textarea-class{
					border-bottom: none !important;
				}
			}
			.detail{
				padding: 18rpx 10rpx 0rpx 10rpx;
				/deep/ .u-textarea-class{
					min-height: 200rpx !important;
				}
			}
			.cell{
				.radio_list{
					margin-left: 15rpx;
					margin-bottom: 15rpx;
					@include  flex-center;
					color: #808080;
					display: flex;
					background-color: #f2f2f2;
					padding: 8rpx;
					text{
						margin-right: 15rpx;
					}
					/deep/ .u-radio__label {
						margin-right: 0;
					}
				}
				.active{
					background-color: #d8f6f0;
					color: #40e09c;
				}
				
			}
		
		}

		.footer {
			margin-top: 30rpx;
			width: 100%;
			padding: 10rpx 80rpx;
			height: 90rpx;
			background-color: #ffffff;
			position: fixed;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			.submit {
				width: 100%;
				height: 100%;
				@include flex-center;
				font-weight: 800;
				font-size: 30rpx;
				border-radius: 30rpx;
				background-color: $page_color;
			}
		}
		
		.flex{
			display: flex;
		}
		.model_wrap{
			padding: 40rpx 20rpx;
			.title{
				width:100%;
				@include flex-center;
				height: 100rpx;
				font-weight: 560;
				font-size:32rpx;
			}
			.model_list{
				padding: 0 0rpx 50rpx 40rpx;
				.price_self{
					@include  flex-jcsb;
					position: relative;
					width: 100%;
					view{
						width: 150rpx;
					}
					input{
						flex: 1;
						transform: translateY(-50%);
						border: 1px solid #e3e3e3;
						text-align: center;
					}
					.price_input{
						position: absolute;
						right: 0;
						top:50%;
						transform: translateY(-50%);
						border: 1px solid #e3e3e3;
						text-align: center;
					}
					.price_label{
						width: 150rpx;
					}
				}
			}
			.btn_ctrl{
				width:100%;
				@include flex-center;
				height: 100rpx;
				font-weight: 550;
				font-size:30rpx;
				background-color: #fff;
				view{
					@include flex-center;
					width: 70%;
					background-color: #ffdf2c;
					border-radius: 8rpx;
					padding: 10rpx 0;
					color: #fff;
				}
			}
		}

		.info_wrap{
			width: 100%;
			display: flex;
			align-items: flex-start;
			padding-left: 50rpx;
			justify-content: flex-start;
			flex-direction: column;
			.title{
				width: 100%;
				margin: 15rpx 0 30rpx 0;
				text-align: center;
				color: #000;
				font-size: 30rpx;
				font-weight: 560;
			}
			.btn_ctrl{
				width:100%;
				@include flex-center;
				height: 100rpx;
				font-weight: 550;
				font-size:30rpx;
				background-color: #fff;
				margin-top: 20rpx;
				view{
					@include flex-center;
					width: 80%;
					background-color: #ffdf2c;
					border-radius: 8rpx;
					padding: 10rpx 0;
					color: #fff;
				}
			}
		}

	


	}
</style>
