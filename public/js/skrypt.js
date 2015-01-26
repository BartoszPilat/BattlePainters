/* jshint browser: true, globalstrict: true, devel: true */
/* global io: false, $: false */
"use strict";

$(function(){

    var state = "disconnected";
    var nick = "";
    var myRoom = "";

    var socket;
    
    $("#game").hide();
    
    if (!socket || !socket.connected) {
                socket = io({forceNew: true});
    }
   
    socket.on('connect', function () {
        console.log('Nawiązano połączenie przez Socket.io');
    });
    socket.on('disconnect', function () {
         console.log('Połączenie przez Socket.io zostało zakończone');
    });
    socket.on("error", function (err) {
         console.log("Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'");
    });

    socket.on("loginOK", function (data) {
        $("#login").hide();
        $("#game").show();
        
        state = "connected";
        nick = data;
        console.log('Otrzymano nick: ' + data);
    });
    socket.on('joinRoom', function (data) {
        myRoom = data;
        console.log('Doączono do pokoju: ' + data);
    });


    

    $("#send").click(function(){
        if($("#nick").val() !== '') {
        socket.emit('login', $("#nick").val());
        console.log('Próba logowania z nickiem: ' + $("#nick").val());
        $("#nick").val('');
        }
    });

});
