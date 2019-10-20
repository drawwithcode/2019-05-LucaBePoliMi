var backgroundImg;

function preload(){

mosquitoImg = loadImage("./assets/mosquito.png");
backpack = loadImage("./assets/backpack.png");
sprayImg = loadImage("./assets/spray_black.png");
backgroundImg = loadImage("./assets/jungle.jpg");

}
// Variables for webcam and microphone
var webcamSource;
var microphoneSource;

// Creating an empty array
var swarm = [];
var mosqNumber = 7; // Number of objects which will be in the array later

// This variable will be used to decrease the amount of mosquitos
var killed;

// Setting the variables for spray image coordinates
var sprayX;
var sprayY;

function setup() {
  createCanvas(windowWidth, windowHeight);


// Setting the webcam window video source
webcamSource = createCapture(VIDEO);
webcamSource.size(640, 480);
webcamSource.hide();//this makes so just 1 webcam window is created

// Setting the microphone to work and record voice
microphoneSource = new p5.AudioIn();
microphoneSource.start();

// Creating an amount of mosquitos and pushing them in the empty array
for(var m = 0; m < mosqNumber; m++) {

var flyingMosquito = new Mosquito(width/2 + random() * 640, 1/6 * height + random() * 480, mosquitoImg.width/8, mosquitoImg.height/8);

swarm.push(flyingMosquito);

}

// If not set it setup these variables can't be changed
killed = 0;

sprayX = 1/10 * width + 198;
sprayY = 1/3 * height;

}

//Variables which will be used in functions

// Variable used to make mosquito disappear 1 at a time and not all the time the volume is > a certain value
var killedToggle = 0;// 0 = false basically
// Used to create the spray image
var spray;
// When "s" is pressed this variable allows the spray to be shown
var sprayCall = 0;
// Used to toggle the dragging state for the spray
var dragging = 0;

function draw() {

background(backgroundImg);

//Creating a dark layer to ensure text readability
push();
noStroke();
var layerColor = color(0, 0, 0);
layerColor.setAlpha(90);
fill(layerColor);
rect(0, 0, width, height);
pop();

// Displaying the webcam
var webcam = webcamSource.loadPixels();
var video = image(webcam, width/2, 1/6 * height, 640, 480);


// Taking the value of the volume from the microphone
var volume = microphoneSource.getLevel();
console.log(volume);

// Instructions
push();

textFont("Ramabhadra");
fill(255, 255, 255);
textSize(30);
noStroke();
if (killed < 7) {
  // Initial
text("Clap those mosquitos!", 1/10 * width, 1/10 * height);
}
else if (killed = 7) {
  // Mosquitos dead
  text("Quick, grab your repellent spray from your backpack before they're back!", 1/10 * width, 1/10 * height);
// For keyboard interaction
if (sprayCall == 1) {
  text("Use it on yourself!", 1/3 * width, height/2, 1/7 * width, height);
}

else if (sprayCall == 0) {
text("The Spray is not showing up. Maybe if you call it by its INITIAL it will come out, but don't make ANY noise", 1/3 * width, height/3, 1/7 * width, height);
}
}
// Victory text
if (sprayX > width/2 && sprayX < width/2 + 640
&& sprayY > 1/6 * height && sprayY < 1/6 * height + 480) {
push();
textAlign(CENTER);
text("You're safe now", width/2 + 640 /2, 1/6 * height + 480/2);
pop();
}
pop();

// if the dragging state is on (happens when mousePressed on the spray),
// the x and y of the spray are calculated so that they follow the mouse while being dragged
// but stay always at the same distance from mouseX and Y
if (dragging == 1) {

sprayX = mouseX + deltaX;
sprayY = mouseY + deltaY;

}

// When all the mosquitos (7) are gone the backpack will be drawn
if (killed == 7) {
// And when also the "s" key will be pressed the spray will be drawn too
  if(sprayCall == 1) {
spray = image(sprayImg, sprayX, sprayY, sprayImg.width/7, sprayImg.height/7);
}

image(backpack, 1/10 * width, 1/3 * height, backpack.width/4, backpack.height/4);
}

// Creating mosquitos, using m, from the filled array
// Killed is used to decrease mosquitos over time with interactions by the user
for(var m = 0; m < swarm.length - killed; m++) {

var flyingMosquito = swarm[m];

flyingMosquito.fly();
flyingMosquito.display();

}


// When the volume from the microphone reaches a certain value and killedToggle is 0,
// killed is increased by 1 and killedToggle becomes = 1
// So that mosquitos are decreased just once and not all the time the volume is > 0.1
if (killedToggle == 0) {
if (volume > 0.1) {


killed++;
killedToggle = 1;

// To avoid problems if killed reaches the max number of the array it cannot increase anymore
  if(killed > 7) { killed = 7;}

}
}
// When the volume drops below 0.1 killedToggle becomes = 0 again and another mosquito can be potentially killed
else if (killedToggle == 1) {
  if (volume <= 0.1) {
    killedToggle = 0;
  }
}


}

// Creating the object mosquito which can be handled easier than a variable
function Mosquito(_x, _y, _width, _height) {

this.x = _x;
this.y = _y;
this.width = _width;
this.height = _height;

this.display = function() {

image(mosquitoImg, this.x, this.y, this.width, this.height);

}

// Moves the mosquito randomly near its original coordinates, simulating its annoying flight path
this.fly = function() {

var flyDelta = 4;

this.x = this.x + random(-flyDelta, flyDelta);
this.y = this.y + random(-flyDelta, flyDelta);

}

}
// When all the mosquitos are dead and the "s" is pressed the spray can be allowed to be drawn
function keyTyped() {
  if (key == "s") {
    if(killed == 7) {
sprayCall = 1;

}
}

}

/*function mouseDragged() {

if (mouseX > sprayX && mouseX < sprayX + sprayImg.width/7
  && mouseY > sprayY && mouseY < sprayY + sprayImg.height/7)
{
sprayDrag();
}

return false;
}

function sprayDrag() {

sprayX = mouseX;
sprayY = mouseY;

}*/

// Since I couldn't have the spray properly dragged just when the mouse was over it I tried this way:


// When the mouse is pressed
function mousePressed() {
// And if the mouse is over the spray
  if (mouseX > sprayX && mouseX < sprayX + sprayImg.width/7
    && mouseY > sprayY && mouseY < sprayY + sprayImg.height/7)
// The dragging state is on
    {
      dragging = 1;
// And the deltas are calculated from the original spray coordinates
// So that the new spray coordinates(while being dragged) will follow the mouse coordinates
// But stay the same distance from the mouse all the time
      deltaX = sprayX - mouseX;
      deltaY = sprayY - mouseY;
    }

}
// Releasing the mouse stops the dragging state
function mouseReleased() {

dragging = 0;

}
