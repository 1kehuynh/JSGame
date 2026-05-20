let upperJaw = new Image;
let lowerJaw = new Image;
let options = new Image;
let time = 0;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const player = {
    room : [],
    bullets: 4,
    turns: 0,
}

const wumpus = {
    health : 5,
    room : [],
    warning : "You smell a horrid stench!"
}

const bats = {
    room : [],
    warning : "You hear high pitched squeaking!"
}

const pits = {
    room : [],
    warning : "You feel a draft!"
}

const cave = [];
const entities = [player, wumpus, bats, pits];
const hazards = [wumpus, bats, pits];

let gameStarted = false;
let wumpusNear = false;

init();

function init(){
    upperJaw.src = "/assets/hunt-upper-jaw.png";
    lowerJaw.src = "/assets/wumpus-bottom-jaw.png";
    options.src = "/assets/options.png";
    locationGeneration();
    requestAnimationFrame(gameLoop);
}

function locationGeneration(){
    let roomsLeft = []
    for(let i = 0; i < 30; i++){
        cave.push({
            id : i,
            connected : []
        })
        roomsLeft.push(i);
    }
    console.log("RoomsLeft: " + roomsLeft);
    for(let entity of entities){
        let roomIndex = Math.floor(Math.random()*roomsLeft.length);
        let room = roomsLeft[roomIndex];
        if(entity == player){  
            entity.room = cave[room].id;
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

function gameLoop(){
    time++;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if(!gameStarted){
        drawMenu();
    } else {
        drawHUD();

    }

    requestAnimationFrame(gameLoop);
}



function drawHUD(){
    ctx.textAlign = "start"
    ctx.fillStyle = "black";
    console.log(document.querySelector('#game').style.border)
    let index = 0;
    ctx.fillStyle = "white"
    ctx.font = "20px serif"
    for(let key in player) {
        ctx.fillText(`${key}: ${player[key]}`, index * 200 + 35, 40);
        index++;
    }

    ctx.font = "23px serif"
    if(warnings.length > 0){
        for(let i = 0; i < warnings.length; i++){
            ctx.fillText(warnings[i], 35, 660 - i * 50);
        }
        ctx.font = "27px serif"
        ctx.fillText("Alerts:", 35, 660 - warnings.length * 50);
    } else {
        ctx.fillText("The Cave is Quiet ... For Now...", 35, 660);
        ctx.font = "27px serif"
        ctx.fillText("Alerts:", 35, 600);
    }

    ctx.fillText("MOVE", 140, 240);
    ctx.textAlign = "right"
    ctx.fillText("SHOOT", canvas.width - 140, 240);
}

let warnings = [];
let adjacent = []
function updateRoom(){
    warnings = [];
    adjacent = [player.room + 1, player.room- 1, player.room + 6, player.room - 6];
    for(let hazard of hazards){
        for(let room of adjacent){
            for(let i = 0; i < hazard.room.length; i++){
                if(hazard.room[i].id == room){
                    console.log(adjacent);
                    console.log(hazard.warning);
                    warnings.push(hazard.warning);
                }
            }
        }
    }
}

document.addEventListener('click', e => {
    if(!gameStarted){
        gameStarted = true;
        updateRoom();
    } else {
    }
})

document.addEventListener('keydown', e => {
    
})



