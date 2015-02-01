/* jshint browser: true, globalstrict: true, devel: true */
/* global io: false, $: false */
"use strict";

/**var player = {
    nick: "",
    nr: 0,
    x: 0,
    y: 0,
    radius: 1,
    //direction = 0-359;
    direction: 0
}*/ 

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

$(function(){

    var state = "disconnected";
    var nick = "";
    var myRoom = 0;
    var myID = 0;
    
    //server stuff
    var socket;
    
    //canvas stuff
    var players = [];
    
    
    //$("#game").hide();
    
    if (!socket || !socket.connected) {
                socket = io({forceNew: true});
    }
   
    //--------------------------------------------------------------//
    //sokety
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
        myRoom = data[0];
        myID = data[0];
        console.log('Doączono do pokoju: ' + data[0] + ' jako: ' + data[1]);
    });
    
    socket.on('game', function (data) {
        console.log("Gracz " + data[1] + " w pokoju " + data[0] + " " + data[2]);
    });
    
    //--------------------------------------------------------------//
    //reakcjie 
    $("#game").click(function(){
        socket.emit('game', [myRoom, myID, "klik"]);
        console.log('gracz kliknal');
    });
    
    $("#send").click(function(){
        if($("#nick").val() !== '') {
        socket.emit('SearchRandom', $("#nick").val());
        console.log('Próba logowania z nickiem: ' + $("#nick").val());
        $("#nick").val('');
        }
    });

});
