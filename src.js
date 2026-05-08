
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// Add a rectangle at (10, 10) with size 100x100 pixels
let x = 10;
let y = 10;

draw();
document.addEventListener('keydown', e => {
    if(e.key == 'a'){
        x -= 5;
        console.log(e.key)
        console.log(x)
    }if(e.key == 'd'){
        x += 5;
    }if(e.key == 'w'){
        y -= 5;
    }if(e.key == 's'){
        y += 5;
    }
    draw();
})

function draw(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "green"
    ctx.fillRect(x, y, 50, 50)
}