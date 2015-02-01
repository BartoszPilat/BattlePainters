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

    var state = "disconnected";
    var nick = "";
    var myID = 1;
    
    //server stuff
    var socket;
    
    //canvas stuff
    var players = [];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    //INPUT
    var keys = new Keys();

$(function(){

    $("#game").hide();
    
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
        myID = data[1];
        console.log('Doączono do pokoju: ' + data[0] + ' jako: ' + data[1]);
    });
    
    socket.on('game', function (data) {
        console.log("Gracz " + data[1] + " w pokoju " + data[0] + " " + data[2]);
    });
    socket.on('play', function (data) {
        console.log("Gra się zaczela");
    });
    
    //--------------------------------------------------------------//
    //reakcjie 
    $("#game").click(function(){
        socket.emit('game', [myID, "klik"]);
        console.log('gracz kliknal');
    });
    
    $(window).keydown(function(e){
        keys.onKeyDown(e);
    });
    $(window).keyup(function(e){
        keys.onKeyUp(e);
    });
    
    $("#send").click(function(){
        if($("#nick").val() !== '') {
        socket.emit('SearchRandom', $("#nick").val());
        console.log('Próba logowania z nickiem: ' + $("#nick").val());
        $("#nick").val('');
        }
    });

});
