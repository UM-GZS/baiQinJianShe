/**
 * 用户的收藏接口
 */
//! 解构获取global_request函数
const {global_request} = getApp().globalData;

export default {
	/**
	 * 新增个人收藏
	 * @param {Object} data 
	 */
	addCollect(data) {
		return global_request('/api/collection/add',data,'POST',true);
	},
	/**
	 * 删除个人收藏
	 */
	deleteCollect(data) {
		return global_request('/api/collection/delete',data,'POST',true);
	},
	/**
	 * 查询个人收藏列表
	 */
	getCollect(data) {
		return global_request('/api/collection/list',data,'GET')
	}
	
}