import io from 'socket.io-client'

const getMiddleware = (socket) => (store) => (next) => (action) => {
  socket.emit('action', action)
  return next(action)
}

const bindDispatch = (socket, dispatch) => {
  socket.on('action', (action) => {
    !action.remote && dispatch(Object.assign({}, action, {remote: true}))
  })
}

export const createSocketMiddleware = (dispatch, url = null) => {
  const socket = io.connect(url)
  bindDispatch(socket, dispatch)
  return getMiddleware(socket)
}