$(function() {
    var socket = io();
    socket.emit('hello world!');
});
