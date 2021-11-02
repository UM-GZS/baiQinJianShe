/**
 * 文章接口
 */

const {global_request} = getApp().globalData;

export default {
	/**
	 * 获取文章详情
	 */
	articleDetail(data) {
		return global_request('/api/article/get',data,'GET');
	},
	/**
	 * 获取文章列表
	 */
	articleList(data) {
		return global_request('/api/article/list',data,'GET')
	}
}