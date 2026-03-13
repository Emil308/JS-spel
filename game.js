//  ------------ Setup ------------
window.focus;
const SCREENWIDTH = innerWidth;
const SCREENHEIGHT = innerHeight;
let playerImage = new Image();
playerImage.src = "Bilder/Spelfigur.png";
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d"); // Drawing object
gameCanvas.height = SCREENHEIGHT / 1.025;
gameCanvas.width = SCREENWIDTH / 1.02;
// -------------------------------------
// Spelar variabler
let playerX = 200;
let playerY = 200;
let playerWidth = 40;
let playerHeight = 40;
let dx = 4;
let dy = 4;
let velocityY = 0;
let gravity = 0.4;
let jumpSpeed = 10;
let onGround = true;

let obstacles = [];
let obstacleSpeed = 5;
let score = 0;
let gameOver = false;

let directions = {
  left: false,
  right: false,
  down: false,
};
// -------------------------------------
// ------------ Starta om spelet ------------
function resetGame() {
  playerX = 200;
  playerY = 200;
  velocityY = 0;
  onGround = true;
  obstacles = [];
  score = 0;
  gameOver = false;
}
// -------------------------------------
// ------------ Spelar-rörelser ------------
document.addEventListener("keydown", (e) => {
  if (gameOver && e.key.startsWith("Arrow")) {
    resetGame();
    return;
  }
  switch (e.key) {
    case "ArrowLeft":
      directions.left = true;
      break;
    case "ArrowRight":
      directions.right = true;
      break;
    case "ArrowUp":
      if (onGround) {
        velocityY = -jumpSpeed;
        onGround = false;
      }
      break;
    case "ArrowDown":
      directions.down = true;
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      directions.left = false;
      break;
    case "ArrowRight":
      directions.right = false;
      break;
    case "ArrowDown":
      directions.down = false;
      break;
    default:
      break;
  }
});
// -------------------------------------
// ------------ Animation ------------
function animate() {
  requestAnimationFrame(animate); // Loopar animationen
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Rensar skärmen varje "frame"

  if (gameOver) {
    // Visa  meddelande när du torskar
    c.fillStyle = "darkred";
    c.font = "36px Arial";
    c.fillText("Jag visste att du skulle förlora, tryck på en piltangent för att försöka vinna", gameCanvas.width / 2 -570, gameCanvas.height / 2);
    return;
  }

  // Update physics
  playerY += velocityY; // Gör att spelare kan flyttas upp och ned på y-axeln
  velocityY += gravity; // Gör att spelaren faller nedåt efter att ha hoppat
  if (playerY >= gameCanvas.height - playerHeight) { // Gör att spelaren inte faller genom golvet
    playerY = gameCanvas.height - playerHeight; // Ändrar spelarens position till golvets nivå
    velocityY = 0;
    onGround = true; // Del av koden som endast tillåter att spelaren hoppar när posiotionen är på golvvets nivå
  }

  // Gör att hinder kan röra sig
  obstacles.forEach(ob => ob.x -= obstacleSpeed); // Gör att alla hinder rör sig mot vänster(tar bort hastigheten från x-positionen)
  obstacles = obstacles.filter(ob => ob.x + ob.width > 0); // Raderar hinder som rört sig förbi spelytan

  // Ritar ut nya hinder
  if (Math.random() < 0.03) { // Sannolikheten att ett hinder genereras per "frame"
    obstacles.push({ //Lägger till nya hinder till listan
      x: gameCanvas.width, //X-positionen för hindrets början
      y: gameCanvas.height - 50, //Y-positionen för hindrets början(-50 på grund av hindrets höjd)
      width: 20, //Bredden på hindret
      height: 50 //Höjden på hindret
    });
  }

  // Check collision
  let collided = obstacles.some(ob => //Skickar tillbaka true eller false
    playerX < ob.x + ob.width && // Tittar om spelarens kant nuddar hindrets kant(vänster)
    playerX + playerWidth > ob.x && // Tittar om spelarens kant nuddar hindrets kant(höger)
    playerY < ob.y + ob.height && // Tittar om spelarens kant nuddar hindrets kant(övre)
    playerY + playerHeight > ob.y // Tittar om spelarens kant nuddar hindrets kant(nedre)
  );
  if (collided) { //Avslutar spelet när spelaren nuddar ett hinder
    gameOver = true;
  }

  // Ritar ut kuben med bilden
  if (playerImage.complete) {
    c.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
  }

  // Ritar ut farliga hinder
  obstacles.forEach(ob => { // Loopar igenom alla hinder i listan
    c.fillStyle = ("red"); //Färgen för hinder;
    c.fillRect(ob.x, ob.y, ob.width, ob.height); //Ritar ut hinder
  });

  // Ritar ut den nuvarande poängen
  c.fillStyle = "gold";
  c.font = "24px Arial";
  c.fillText("Poäng: " + score, 550, 30);
  score++;

  // Vinna spelet
  if (score >= 2345) {
    // Visa vinstmeddelande och stoppa lidandet
    c.fillStyle = "gold";
    c.font = "48px Arial";
    c.fillText("Du vann!", gameCanvas.width / 2 - 100, gameCanvas.height / 2);
    return; // Stoppar spelet
  }

  if (directions.right) {
    if (playerX + dx + playerWidth <= gameCanvas.width){
      playerX += dx;
    }
  }

  if (directions.left) {
    if (playerX - dx >= 0) {
      playerX -= dx;
    }
  }

  if (directions.down) {
    if(playerY + dy + playerHeight <= gameCanvas.height){
    playerY += dy;
    }
  }
}
// -------------------------------------
// ------------ Start game ------------
animate();
