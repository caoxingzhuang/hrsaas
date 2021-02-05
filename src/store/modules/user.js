import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  setToken: (state, token) => {
    state.token = token
    setToken(token)
  },
  removeToken: (state) => {
    state.token = null
    removeToken()
  },
  setUserInfo: (state, userInfo) => {
    state.userInfo = { ...userInfo }
  },
  reomveUserInfo: (state) => {
    state.userInfo = {}
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
  },

  // get user info
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    context.commit('setUserInfo', baseResult)
    return baseResult
  },

  // user logout
  // 登出的action
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('reomveUserInfo') // 删除用户信息
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

