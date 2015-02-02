function StartGame(){
  players = [
        {
        x: 200,
        y: 100,
        radius: 10,
        //direction = 0-359;
        direction: 225,
        color: "#FF0000"
    }  ,
        {
        x: 600,
        y: 100,
        radius: 10,
        //direction = 0-359;
        direction: 315,
        color: "#00FF00"
    },
        {
        x: 200,
        y: 300,
        radius: 10,
        //direction = 0-359;
        direction: 135,
        color: "#0000FF"
    },
        {
        x: 600,
        y: 300,
        radius: 10,
        //direction = 0-359;
        direction: 45,
        color: "#FF00FF"
    }
  ];
}

// z neta - dostarcza wiadomoć o kolejnej klatce do zanimowania zależnie d przeglądarki
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function Frame(){
    requestAnimFrame(Frame);
    if(state === "play" && elapsed < timeLeft){
        calcNextFrame();
        getInput();
        socket.emit('position',[myID, players[myID]]);

        elapsed = Date.now() - start;
    }
    if(state === "play" && elapsed > timeLeft){
        state = "afterGame";
    }
    if(state === "afterGame"){
        var w,h;
        var index;
        var playerColor = hexToRgb(players[myID].color);
        imageData = ctx.getImageData(0,0,width,height);
       
        for(h = 0 ; h < height; h++){
            for(w = 0 ; w < width; w++){
                index = 4 * (w + h * width);
                var red   = imageData.data[index    ];  // red   color
                var green = imageData.data[index + 1];  // green color
                var blue  = imageData.data[index + 2];  // blue  color
                var alpha = imageData.data[index + 3];
                
                if(playerColor.r === red && playerColor.b === blue && playerColor.g === green){
                    playerPoints++;
                }
            }
        }
        socket.emit('points', [myID, playerPoints, nick]);
        state = "leaderBoard";
    }
    if(state === "leaderBoard" && leaderboard.length === 4){
        var i = 0;
        var x = canvas.width/2, y = canvas.height/2;
        leaderboard.sort(function(a, b){return b.p-a.p});
        
        ctx.font = "60px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Game End", x, y);
        ctx.font = "30px Arial";
        for(i = 0; i < leaderboard.length; i++){
            ctx.fillText(leaderboard[i].n + ": " + leaderboard[i].p,x,y+30*(i+1));
        }
    }
    else{
        drawPlayers();
    }
}

/*function calcNextFrame(){
    var i,j;
    
    for(i = 0; i < players.length; i++)
    {
        //colisions with other players
        for(j = 0; j < players.length; j++)
        {
            if(i === j) continue;
            calcColWithPlayer(players[i],j);
        }
        //colision with boundaries
        if(players[i].x < 0) players[i].x = 0;
        if(players[i].y < 0) players[i].y = 0;
        
        if(players[i].x > 800) players[i].x = 800;
        if(players[i].y > 400) players[i].y = 800;
        
        movePlayer(players[i]);
    }
}*/
function calcNextFrame(){
    var i,j;
    //colisions with other players
    for(j = 0; j < players.length; j++)
    {
        if(i === j) continue;
        calcColWithPlayer(players[myID],j);
    }
    //colision with boundaries
    if(players[myID].x < 0) players[myID].x = 0;
    if(players[myID].y < 0) players[myID].y = 0;
        
    if(players[myID].x > 800) players[myID].x = 800;
    if(players[myID].y > 400) players[myID].y = 400;
        
    movePlayer(players[myID]);
    
}

function calcColWithPlayer(player,j){
    var other = players[j];
    
    var dx = player.x - other.x;
    var dy = player.y - other.y;
    var distance = Math.sqrt(dx*dx + dy*dy);
    
    if(distance <= player.radius + other.radius){
        player.direction += 180;
        other.direction += 180;
    }
}

function movePlayer(player){ 
    var radians=Math.PI/180;
    player.x += (player.radius/5) * Math.cos(player.direction * radians);
    player.y += (player.radius/5) * Math.sin(player.direction * radians);
}

function drawPlayers(){
    var i;
    
    for(i = 0; i < players.length; i++)
    {
        drawCircle(players[i].x,players[i].y,players[i].radius,players[i].color);
    }
}

function drawCircle(x, y, radius, color){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function getInput(){
    if(keys.left) players[myID].direction = players[myID].direction - 2;
    else if(keys.right) players[myID].direction = players[myID].direction + 2;
    players[myID].direction = players[myID].direction % 360;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


//reset vars
StartGame();

// Start animation
Frame();
