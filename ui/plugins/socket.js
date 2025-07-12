import io from 'socket.io-client'

export default ({ $config, $utils }, inject) => {
  try{
    const socketUrl = $config.socketUrl || 'http://localhost:3000'

    if (socketUrl) {
      const socket = io(socketUrl, {
        query: {
          user: $utils.generateUUID('socket')
        },
        transports: ['websocket'], 
        reconnectionDelayMax: 10000,
        forceBase64: false,  
        reconnection: true,
      })
      let socketReconnect
  
      const socketReconnectDeactivate = () => {
        if (socketReconnect) {
          clearInterval(socketReconnect)
        }
      }
  
      const socketReconnectActivate = (time = 3000) => {
        
        socketReconnectDeactivate()
  
        socketReconnect = setInterval(() => {
          socket.connect()
          console.log('try reconnect')
        }, time)
      }
  
      socket.on('disconnect', () => {
        console.log('disconnected')
        socketReconnectActivate()
      })
      socket.on('connect', () => {
        socketReconnectDeactivate()
        console.log('connected')
      })
  
      inject('socket', socket)
    } else {
      console.warn('소켓 주소가 올바르지 않습니다.')
    }
  } catch(err) {
    console.warn('소켓연결오류', err)
  }
 

}
