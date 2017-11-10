'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSocketMiddleware = undefined;

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMiddleware = function getMiddleware(socket) {
  return function (store) {
    return function (next) {
      return function (action) {
        socket.emit('action', action);
        return next(action);
      };
    };
  };
};

var bindDispatch = function bindDispatch(socket, dispatch) {
  socket.on('action', function (action) {
    !action.remote && dispatch(Object.assign({}, action, { remote: true }));
  });
};

var init = function init(socket) {
  return socket.emit('init');
};

var createSocketMiddleware = exports.createSocketMiddleware = function createSocketMiddleware(dispatch) {
  var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var preload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var socket = _socket2.default.connect(url);
  bindDispatch(socket, dispatch);
  preload && init(socket);
  return getMiddleware(socket);
};