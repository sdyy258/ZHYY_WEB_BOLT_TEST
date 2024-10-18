import store from '@/store/'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { baseURL } from '@/utils/request'

export const WebsocketMixin = {
  data() {
    return {
      lockReconnect: false,
      wsUUID: this.$utils.guid(),
      timeOutId: null
    }
  },
  mounted() {
    this.initWebSocket()
  },
  beforeDestroy() {
    this.lockReconnect = true
    this.removeTimeOut()
    this.websock.close()
  },
  methods: {
    initWebSocket: function() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      // console.log('------------WebSocket连接成功')
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userId = store.getters.userInfo.id
      if (!this.socketUrl.startsWith('/')) {
        this.socketUrl = '/' + this.socketUrl
      }
      if (!this.socketUrl.endsWith('/')) {
        this.socketUrl = this.socketUrl + '/'
      }
      var url
      if (process.env.NODE_ENV === 'development') {
        url = baseURL.replace('https://', 'wss://').replace('http://', 'ws://') + '/websocket/' + userId
      } else if (process.env.NODE_ENV === 'test') {
        url = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/websocket/` + userId
      } else {
        url = baseURL.replace('https://', 'wss://').replace('http://', 'ws://') + '/websocket/' + userId
      }
      url = url + this.wsUUID
      // var url = window._CONFIG['domianURL'].replace("https://","wss://").replace("http://","ws://") + this.socketUrl + userId + "/" + token;
      // update-begin-author:taoyan date:2022-4-22 for:  v2.4.6 的 websocket 服务端，存在性能和安全问题。 #3278
      this.websock = new WebSocket(url, [token])
      // update-end-author:taoyan date:2022-4-22 for:  v2.4.6 的 websocket 服务端，存在性能和安全问题。 #3278
      this.websock.onopen = this.websocketOnopen
      this.websock.onerror = this.websocketOnerror
      this.websock.onmessage = this.websocketOnmessage
      this.websock.onclose = this.websocketOnclose
    },
    websocketOnopen: function() {
      console.log('WebSocket连接成功')
    },
    websocketOnerror: function(e) {
      console.log('WebSocket连接发生错误')
      this.reconnect()
    },
    websocketOnmessage(res) {
    },
    websocketOnclose: function(e) {
      console.log('WebSocket已断开')
      this.reconnect()
    },
    websocketSend(text) {
      // 数据发送
      try {
        this.websock.send(text)
      } catch (err) {
        console.log('send failed (' + err.code + ')')
      }
    },
    removeTimeOut() {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId)
        this.timeOutId = null
      }
    },
    reconnect() {
      if (this.lockReconnect === false) {
        // 没连接上会一直重连，设置延迟避免请求过多
        this.lockReconnect = true
        this.removeTimeOut()
        this.timeOutId = setTimeout(() => {
          console.info('websocket尝试重连...')
          this.initWebSocket()
          this.lockReconnect = false
        }, 5000)
      }
    }
  }
}
