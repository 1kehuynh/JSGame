let upperJaw = new Image;
let lowerJaw = new Image;
let options = new Image;
//let button = new Image;

let time = 0;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let warnings = [];
let adjacent = [];
let roomsVisited = [];
const cave = [];

let gameStarted = true;
let gameOver = false;

const player = {
    room : [],
    bullets: 3,
    turns: -1,
}

const wumpus = {
    health : 5,
    room : [],
    warning : "You smell a horrid stench!",
    action: function(){
        console.log("wumpus");
        gameOver = true;
    }
   
}

const bats = {
    room : [],
    warning : "You hear high pitched squeaking!",
    action: function(){
        console.log("bat");
        player.room[0] = cave[Math.floor(Math.random()*cave.length)];
        updateRoom();

    }
}

const pits = {
    room : [],
    warning : "You feel a draft!",
    action: function(){
        console.log("draft");
        gameOver = true;
    }
}

const entities = [player, wumpus, bats, pits];
const hazards = [wumpus, pits, bats];


init();

function init(){
    upperJaw.src = "/assets/hunt-upper-jaw.png";
    lowerJaw.src = "/assets/wumpus-bottom-jaw.png";
    options.src = "/assets/options.png";
    //button.src = "/assets/arrow-key.png"
    for(let i = 0; i < 4; i++){
        document.querySelector('#move').innerHTML += `<img src="/assets/arrow-key.png" class="moveBtns" id="move${i}" width="50px" role="button" height="50px" style="transform: rotate(${i*90}deg)">`;
        //document.querySelector('#move').innerHTML += `<div width="50px" height="50px " class="place"></div>`
    }
    for(let i = 0; i < 4; i++){
        document.querySelector('#shoot').innerHTML += `<img src="/assets/arrow-key.png" class="shootBtns" id="shoot${i}" width="50px" role="button" height="50px" style="transform: rotate(${i*90}deg)">`;
    }
    document.childNodes
    document.querySelectorAll('.moveBtns').forEach(img => {
        img.addEventListener("click", e => {
            if(img.id == 'move0'){
                if(player.room[0] > 5){
                    player.room[0] = cave[player.room[0] - 6];
                }
            }else if(img.id == 'move1'){
                if((player.room[0] + 1) % 6 != 0){
                    player.room[0] = cave[player.room[0] + 1];
                }
            }else if(img.id == 'move2'){
                if(player.room[0] < 24){
                    player.room[0] = cave[player.room[0] + 6];                 
                }
            }else if(img.id == 'move3'){
                if((player.room[0] % 6) != 0){
                    player.room[0] = cave[player.room[0] - 1];
                }
            }
            updateRoom();
        })
    });
    
    document.querySelectorAll('.shootBtns').forEach(img => {
        img.addEventListener("click", e => {
            if(img.id == 'shoot0'){
                if(player.room[0] > 5){
                    player.room[0] = cave[player.room[0] - 6];
                }
            }else if(img.id == 'shoot1'){
                if(((player.room[0] + 1) % 6) != 0){
                    player.room[0] = cave[player.room[0] + 1];
                }
            }else if(img.id == 'shoot2'){
                if(player.room[0] < 24){
                    player.room[0] = cave[player.room[0] + 6];
                }
            }else if(img.id == 'shoot3'){
                if((player.room[0] % 6) != 0){
                    player.room[0] = cave[player.room[0] - 1];
                }
            }
            player.bullets--;
            if(player.bullets == 0){
                gameOver = true;
            }
        })
    });
    locationGeneration();
    updateRoom();
    requestAnimationFrame(gameLoop);
}

function locationGeneration(){
    let roomsLeft = [];
    for(let i = 0; i < 30; i++){
        roomsLeft.push(i);
        cave.push(i);
    }
    console.log("RoomsLeft: " + roomsLeft);
    for(let entity of entities){
        let roomIndex = Math.floor(Math.random()*roomsLeft.length);
        let room = roomsLeft[roomIndex];
        if(entity == player){  
            entity.room.push(cave[room]);
            roomsLeft.splice(roomIndex, 1)
        } else if(entity == wumpus){
            entity.room.push(cave[room]);
            roomsLeft.splice(roomIndex, 1);
        } else {
            entity.room.push(cave[room]);
            roomsLeft.splice(roomIndex, 1);
            roomIndex = Math.floor(Math.random()*roomsLeft.length);
            room2 = roomsLeft[roomIndex];
            entity.room.push(cave[room2]);
            roomsLeft.splice(roomIndex, 1);
            console.log("Room2: " + room2);
        }
        console.log("room: " + room)
        console.log("roomsLeft: " + roomsLeft)
    }
}

function drawMenu(){
    ctx.font = "27px serif"
    ctx.textAlign = "center"
    ctx.drawImage(upperJaw, canvas.width/2 - upperJaw.width/2 , 15*Math.cos((Math.PI/200) * time) + 40);
    ctx.drawImage(lowerJaw, canvas.width/2 - lowerJaw.width/2, -15*Math.cos((Math.PI/200) * time) + 200);
    ctx.fillStyle = "red";
    ctx.fillText("Tap Anywhere to Start", canvas.width/2, canvas.height/2);
}

let xPos = 0;
let yPos = 0;
function gameLoop(){
    time++;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if(!gameStarted){
        drawMenu();
    }else if(gameOver){
        
    }else {
        drawHUD();
        drawGame();
    }

    requestAnimationFrame(gameLoop);
}

let roomW = 80;
let roomH = 80;
let xOffSet = 120;
function drawGame(){
    for(let i = 0; i < 5; i++){
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for(let j = 0; j < 6; j++){
            if(player.room[0] == i * 6 + j){
                ctx.fillStyle = "white"
                ctx.fillRect(j * roomW + (1280/2 - (roomW * 6)/2), i * roomH + xOffSet, roomW, roomH);
                ctx.fillStyle = "red";
                ctx.fillText(i * 6 + j, j * roomW + (1280/2 - (roomW * 6)/2) + roomW/2, i * roomH + (roomH/2) + xOffSet);
            } else {
                ctx.fillStyle = "white"
                ctx.fillText(i * 6 + j, j * roomW + (1280/2 - (roomW * 6)/2) + roomW/2, i * roomH + (roomH/2) + xOffSet);
                for(let k = 0; k < roomsVisited.length; k++){
                    if(i * 6 + j == roomsVisited[k]){
                        ctx.fillStyle = "gray";
                        ctx.fillRect(j * roomW + (1280/2 - (roomW * 6)/2), i * roomH + xOffSet, roomW, roomH);
                        ctx.fillStyle = "black";
                        ctx.fillText(i * 6 + j, j * roomW + (1280/2 - (roomW * 6)/2) + roomW/2, i * roomH + (roomH/2) + xOffSet);
                        break;
                    }
                }
                 
            }
            ctx.strokeStyle = "white";
            ctx.strokeRect(j * roomW + (1280/2 - (roomW * 6)/2), i * roomH + xOffSet, roomW, roomH);
        }
    }
}

let original = ctx.getTransform();
function drawHUD(){
    ctx.setTransform(original);
    ctx.textAlign = "start";
    ctx.fillStyle = "black";
    let index = 0;
    ctx.fillStyle = "white"
    ctx.font = "20px serif"
    for(let key in player) {
        if(key == 'room'){
            ctx.fillText(`${key}: ${player[key][0]}`, index * 200 + 35, 40);
        }
        else{
            ctx.fillText(`${key}: ${player[key]}`, index * 200 + 35, 40);
        }
        index++;
    }

    ctx.font = "23px serif"
    if(warnings.length > 0){
        for(let i = 0; i < warnings.length; i++){
            if(warnings[i] == wumpus.warning){
                ctx.fillStyle = "red";
            }else{
                ctx.fillStyle = "white";
            }
            ctx.fillText(warnings[i], 35, 660 - i * 50);
        }
        ctx.font = "27px serif"
        ctx.fillText("Alerts:", 35, 660 - warnings.length * 50);
    } else {
        ctx.fillText("The Cave is Quiet ... For Now...", 35, 660);
        ctx.font = "27px serif"
        ctx.fillText("Alerts:", 35, 600);
    }

    ctx.fillText("MOVE", 110, 200);
    ctx.textAlign = "right";
    ctx.fillText("SHOOT", canvas.width - 110, 200);
    /*
    ctx.translate(194,340);
    for(let i = 0; i < 4; i++){
        ctx.drawImage(button, -30, -100, 60, 60);
        ctx.rotate(-Math.PI/2);
    }
    ctx.fillText('x: ' + xPos, 100, 300);
    ctx.fillText('y: ' + yPos, 300, 300);
    */
}

function updateRoom(){
    warnings = [];
    roomsVisited.push(player.room[0]);
    player.turns++;
    console.log(roomsVisited)
    function playerRight(){
        if((player.room[0] + 1) % 6 != 0){
            return player.room[0] + 1;
        } else {
            return -1;
        }
    }
    function playerLeft(){
        if((player.room[0]) % 6 != 0){
            return player.room[0] - 1;
        } else {
            return -1;
        }
    }
    adjacent = [playerRight(), playerLeft(), player.room[0] + 6, player.room[0] - 6];
    /*for each hazard, for each room in hazard, if the room equals the player's room, execute it's action, 
    else for each room in adjacent, check the hazard's room against the adjacent rooms*/
    for(let hazard of hazards){
        for(let i = 0; i < hazard.room.length; i++){
            if(hazard.room[i] == player.room[0]){
                console.log("hazard")
                hazard.action();
            } else {
                for(let room of adjacent){
                    if(hazard.room[i] == room){
                        console.log(adjacent);
                        console.log(hazard.warning);
                        warnings.push(hazard.warning);
                    }
                    
                }
            }
        }
    }

}

document.addEventListener('click', e => {
    if(!gameStarted){
        gameStarted = true;
    } else {
    }
})


document.addEventListener('mousemove', e => {
    xPos = e.clientX;
    yPos = e.clientY;
})



