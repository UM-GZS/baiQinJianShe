/**
 * 关于求职招聘所有的接口封装
 * 调用封装在App.vue 里面的global_request
 * 参数详解:global_request(url, data, method, flag)
 * url:表示拼接的地址,data:数据对象,method:请求方式,flag:可以不传值
 */
//! 解构获取global_request函数
const {global_request} = getApp().globalData;

export default {
	/**
	 * 用户求职,查询列表
	 */
	listJob(data) {
		return global_request('/api/jobsearch/list',data,'GET')
	},
	/**
	 *  用户求职,添加
	 */
	addJob(data) {
		return global_request('/api/jobsearch/add',data,'POST',true)
	},
	/**
	 *  用户求职,删除
	 * @param {object} data 
	 */
	deleteJob(data) {
		return global_request('/api/jobsearch/delete',data,'POST',true)
	},
	/**
	 *  用户求职,修改
	 * @param {object} data 
	 */
	updateJob(data) {
		return global_request('/api/jobsearch/update',data,'POST',true)
	},
	
}
