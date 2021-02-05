/* eslint-disable no-undef */
// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
// const TimeOut = 5400
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
}) // 创建一个axios的实例
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
}
) // 请求拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
}
) // 响应拦截器
// 导出axios实例
export default service
