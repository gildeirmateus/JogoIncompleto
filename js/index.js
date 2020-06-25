const cnv = document.createElement('canvas');
const ctx = cnv.getContext('2d');
cnv.width = 900;
cnv.height = 640;
document.body.appendChild(cnv);

var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
var mvLeft = mvUp = mvRight = mvDown = false;
var tileSize = 80;
var tileSrcSize = 96;
var img = new Image();
    img.src = "images/img.png";
    img.addEventListener("load", function(){
        requestAnimationFrame(Start, cnv);
    },false);


var walls = [];

var player = {
    x: tileSize + 2, 
    y: tileSize + 2,
    width: 24,
    height: 32,
    speed: 1.5, 
    srcX: 0,
    srcY: tileSrcSize, 
    counAnim: 0
};


//estados do jogo
var START = 1, PLAY = 2, OVER = 3;
var gameState = START;

//mensagens
var messages = [];
var startMessage = {
    text: "TOUCH TO START",
    y: cnv.height/2 - 100,
    font: "bold 30px Sans-Serif",
    color: "#a9a9a9a9",
    visible: true
};
messages.push(startMessage);

//eventos
cnv.addEventListener('mousedown', function(e){
    switch(gameState){
        case START:
            gameState = PLAY;
            startMessage.visible = false;
            break;
    }
}, false);

var maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,1,0,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1], 
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
];

var T_WIDTH = maze[0].length * tileSize,
    T_HEIGHT = maze.length * tileSize; 

for(var row in maze){
    for(var column in maze[row]){
        var tile = maze[row][column];
        if(tile === 1){
            var wall = {
                x: tileSize*column,
                y: tileSize*row,
                width: tileSize,
                height: tileSize
            };
            walls.push(wall);
        }
    }
}

var cam = {
    x: 0,
    y: 0,
    width: cnv.width,
    height: cnv.height,
    innerLeftBoundary: function(){
        return this.x + (this.width*0.25);
    },
    innerTopBoundary: function(){
        return this.y + (this.height*0.25);
    },
    innerRigthBoundary: function(){
        return this.x + (this.width*0.75);
    },
    innerBottomBoundary: function(){
        return this.y + (this.height*0.75);
    }
};

function blockRectangle(objA, objB){
    var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
    var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);

    var sumWidth = (objA.width + objB.width)/2;
    var sumHeigth = (objA.height + objB.height)/2;

    if(Math.abs(distX) < sumWidth && Math.abs(distY) <sumHeigth){
        var overlapX = sumWidth - Math.abs(distX);
        var overlapY = sumHeigth - Math.abs(distY);

        if(overlapX > overlapY){
            objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;  
        }else{
            objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;  
        }

    }
}

window.addEventListener("keydown", keydownHandler, false);
window.addEventListener("keyup", keyupHandler, false);

function keydownHandler(e){
    var key = e.keyCode;
    switch(key){
        case 65:
            mvLeft = true;
            break;
        case 87:
            mvUp = true;
            break;
        case 68:
            mvRight = true;
            break;
        case 83:
            mvDown = true;
            break;
    }
}

function keyupHandler(e){
    var key = e.keyCode;
    switch(key){
        case 65:
            mvLeft = false;
            break;
        case 87:
            mvUp = false;
            break;
        case 68:
            mvRight = false;
            break;
        case 83:
            mvDown = false;
            break;
    }
}

function update(){
    if(mvLeft && !mvRight){
        player.x -= player.speed;
        player.srcY = tileSrcSize + player.height * 2;

    }else 
    if(mvRight && !mvLeft){
        player.x += player.speed;
        player.srcY = tileSrcSize + player.height * 3;

    }
    if(mvUp && !mvDown){
        player.y -= player.speed;
        player.srcY = tileSrcSize + player.height * 1;

    }else
    if(mvDown && !mvUp){
        player.y += player.speed;
        player.srcY = tileSrcSize + player.height * 0;
    }

    if(mvLeft || mvRight || mvUp || mvDown){
        player.counAnim++;
        if(player.counAnim >= 40){
            player.counAnim = 0;
        }
        player.srcX = Math.floor(player.counAnim/5) * player.width;
    }else{
        player.srcX = 0;
        player.counAnim = 0;
    }

    for(var i in walls){
        var wall = walls[i];
        blockRectangle(player, wall);
    }

    if(player.x < cam.innerLeftBoundary()){
        cam.x = player.x - (cam.width * 0.25);
    }
    if(player.y < cam.innerTopBoundary()){
        cam.y = player.y - (cam.height * 0.25);
    }
    if(player.x + player.width > cam.innerRigthBoundary()){
        cam.x = player.x + player.width - (cam.width * 0.75);
    }
    if(player.y + player.height > cam.innerBottomBoundary()){
        cam.y = player.y + player.height - (cam.height  * 0.75);
    }

    cam.x = Math.max(0, Math.min(T_WIDTH - cam.width, cam.x));
    cam.y = Math.max(0, Math.min(T_HEIGHT - cam.height, cam.y));

}

function render(){
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.save();
    ctx.translate(-cam.x, -cam.y);
    for(var row in maze){
        for(var column in maze[row]){
            var tile = maze[row][column];
            var x = column*tileSize;
            var y = row*tileSize;
  
            ctx.drawImage(
                img,
                tile * tileSrcSize, 0, tileSrcSize, tileSrcSize,
                x,y,tileSize, tileSize
            );
        }
    }
    ctx.drawImage(
        img,
        player.srcX, player.srcY, player.width, player.height,
        player.x, player.y, player.width, player.height
    );

    ctx.restore();
}


function menuGame(){

    //renderização das mensagens de texto
    for(var i in messages){
        var msg = messages[i];
        if(msg.visible){
            ctx.font = msg.font;
            ctx.fillStyle = msg.color;
            ctx.fillText(msg.text, (cnv.width - ctx.measureText(msg.text).width)/2, msg.y);
        }
    }  
}

Start();

function Start(){
    requestAnimationFrame(Start, cnv);

    menuGame();

    if(gameState === PLAY){
        update();
        render();
    }
}



