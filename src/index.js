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

const init = (socket) => socket.emit('init')

export const createSocketMiddleware = (dispatch, url = null, preload = true) => {
  const socket = io.connect(url)
  bindDispatch(socket, dispatch)
  preload && init(socket)
  return getMiddleware(socket)
}