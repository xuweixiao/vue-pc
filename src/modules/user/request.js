import { get, post } from '@/common/net/serviceUtil'

/**
 * 用户列表
 * @param {string} params.name
 * @param {Object} params.pageDto
 *
 * @returns {Promise}
 */
export function userList(params) {
  return get('/admin/list', params)
}

/**
 * 添加用户
 * @param {string} params.username
 *
 * @returns {Promise}
 */
export function addUser(params) {
  return post('/admin/add', params)
}

/**
 * 删除用户
 * @param {string} params.uid
 *
 * @returns {Promise}
 */
export function deleteUser(params) {
  return post('/admin/delete', params)
}

/**
 * 修改密码
 * @param {string} params.oldPassword
 * @param {string} params.newPassword
 *
 * @returns {Promise}
 */
export function modifyPass(params) {
  return post('/user/resetPassword', params)
}
