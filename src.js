let upperJaw = new Image;
let lowerJaw = new Image;
let options = new Image;
//let button = new Image;

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

let gameStarted = true;
let wumpusNear = false;

init();

function init(){
    upperJaw.src = "/assets/hunt-upper-jaw.png";
    lowerJaw.src = "/assets/wumpus-bottom-jaw.png";
    options.src = "/assets/options.png";
    //button.src = "/assets/arrow-key.png"
    for(let i = 0; i < 4; i++){
        document.querySelector('#move').innerHTML += `<img src="/assets/arrow-key.png" id="move${i}" width="50px" height="50px" style="transform: rotate(${i*90}deg)">`;

        document.querySelector('#move').innerHTML += `<div width="50px" height="50px " class="place"></div>`
    }
    document.querySelectorAll('img').forEach(img => {
        if(img.id == 'move0'){
            img.addEventListener("click", e => {
                if(player.room[0].id > 6){
                    player.room[0] = cave[player.room[0].id - 6]
                }
            })
        } else if(img.id == 'move1'){
            img.addEventListener("click", e => {
                if((player.room[0].id + 1) % 6 != 0){
                    player.room[0] = cave[player.room[0].id + 1]
                }
            })
        }  else if(img.id == 'move1'){
            img.addEventListener("click", e => {
                if((player.room[0].id + 1) % 6 != 0){
                    player.room[0] = cave[player.room[0].id + 1]
                }
            })}
    })
    //document.querySelector('#move')*/
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
    } else {
        drawHUD();

    }

    requestAnimationFrame(gameLoop);
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
            ctx.fillText(`${key}: ${player[key][0].id}`, index * 200 + 35, 40);
        }
        else{
            ctx.fillText(`${key}: ${player[key]}`, index * 200 + 35, 40);
        }
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

    ctx.fillText("MOVE", 149, 200);
    ctx.textAlign = "right";
    ctx.fillText("SHOOT", canvas.width - 149, 200);
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


document.addEventListener('mousemove', e => {
    xPos = e.clientX;
    yPos = e.clientY;
})



