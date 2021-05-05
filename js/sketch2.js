
//Local Instance of Canvas
//Reference: https://github.com/processing/p5.js/wiki/Global-and-instance-mode
const s0 = (sketch) => {
  let tempVal, xCenter, yCenter, visRad, circRad, checkpoint1, checkpoint2;
  let fillColor = [];

  let width = 180;
  let height = 95;
  let img = sketch.loadImage('../img/gauge-center.svg');
  sketch.setup = () => {
    let canvas = sketch.createCanvas(width, height);
    // canvas.id("")
    //val is the value used to determine the position of the circle.
    //>>swap this with the value of incoming data.
    tempVal = Math.PI; // Made the switch to use Math.PI

    //making the slider. Remove and swap with incoming data value using val
    slider1 = sketch.createSlider(0, 10, 0, 0.1);
    slider1.position(10, 10);
    slider1.style('width', '150px');
    slider1.input(sketch.sliderInput);

    xCenter = width / 2;
    yCenter = height / 2;

    //the radius of the arc
    visRad = 60;

    //the size of the moving circle
    circRad = 20;

    //where the colors start and end
    checkpoint1 = 4;
    checkpoint2 = 6;

    //the mapping of the moving circle to a semicircle
    valMin = 0;
    valMax = 10;

    //this should be replaced with a function that runs on a time interval to do the same job. The trigger for this is slider interaction at the moment.
    sketch.sliderInput();
  }
  sketch.draw = () => {
    sketch.rectMode(sketch.CENTER);
    tempVal = sketch.map(slider1.value(), valMin, valMax, Math.PI, 2 * Math.PI);
    sketch.background(255);

    //the arc that the little circle moves around
    sketch.noFill();
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeWeight(circRad - 3);
    sketch.stroke(220);
    sketch.arc(xCenter, yCenter, visRad, visRad, Math.PI, 2 * Math.PI, sketch.OPEN);

    //make the little circle
    sketch.strokeWeight(1);
    sketch.stroke(150);
    sketch.fill(fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
    sketch.circle(.5 * visRad * Math.cos(tempVal) + xCenter, .5 * visRad * Math.sin(tempVal) + yCenter, circRad);

    //import the svg for the arrow and spin it
    sketch.push();
    sketch.translate(width / 2, height / 2);
    sketch.rotate(tempVal + Math.PI / 2);
    sketch.image(img, -5, -10, 10, 15);
    sketch.pop();
  }
  sketch.sliderInput = () => {
    //these are the vectors that are used to conditionally color the circle.
    //I used vectors because it's easier to lerp between vectors.
    let v1 = sketch.createVector(238, 196, 125);
    let v2 = sketch.createVector(129, 205, 190);

    //this is the vector that holds the lerp value for the circle. don't touch it :)
    let v3 = sketch.createVector(0, 0, 0);
    let lerpVar;

    // console.log(val);

    //add more conditionals if you need to accommodate more checkpoints
    if (tempVal < checkpoint1) {
      fillColor = [v1.x, v1.y, v1.z, 180];
    } else if (checkpoint1 < tempVal && tempVal < checkpoint2) {
      //this is the lerp zone, the difference between checkpoint 1 and 2. Here, the color will fade from color 1 to color 2.
      lerpVar = checkpoint2 - tempVal;
      lerpVar = sketch.map(checkpoint2 - tempVal, 0, (checkpoint2 - checkpoint1), 1, 0);
      v3 = p5.Vector.lerp(v1, v2, lerpVar);
      fillColor = [v3.x, v3.y, v3.z, 180];
      console.log("lerp zone", lerpVar, tempVal);
    } else {
      fillColor = [v2.x, v2.y, v2.z, 180];
    }
  }
}

const s1 = (sketch) => {
  let val, xCenter, yCenter, visRad, circRad, checkpoint1, checkpoint2;
  let fillColor = [];

  let width = 180;
  let height = 95;
  let img = sketch.loadImage('../img/gauge-center.svg');
  sketch.setup = () => {
    let canvas = sketch.createCanvas(width, height);
    // canvas.id("")
    //val is the value used to determine the position of the circle.
    //>>swap this with the value of incoming data.
    val = Math.PI; // Made the switch to use Math.PI

    //making the slider. Remove and swap with incoming data value using val
    slider = sketch.createSlider(0, 10, 0, 0.1);
    slider.position(10, 40);
    slider.style('width', '150px');
    slider.input(sketch.sliderInput);

    xCenter = width / 2;
    yCenter = height / 2;

    //the radius of the arc
    visRad = 60;

    //the size of the moving circle
    circRad = 20;

    //where the colors start and end
    checkpoint1 = 4;
    checkpoint2 = 6;

    //the mapping of the moving circle to a semicircle
    valMin = 0;
    valMax = 10;

    //this should be replaced with a function that runs on a time interval to do the same job. The trigger for this is slider interaction at the moment.
    sketch.sliderInput();
  }
  sketch.draw = () => {
    sketch.rectMode(sketch.CENTER);
    val = sketch.map(slider.value(), valMin, valMax, Math.PI, 2 * Math.PI);
    sketch.background(255);

    //the arc that the little circle moves around
    sketch.noFill();
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeWeight(circRad - 3);
    sketch.stroke(220);
    sketch.arc(xCenter, yCenter, visRad, visRad, Math.PI, 2 * Math.PI, sketch.OPEN);

    //make the little circle
    sketch.strokeWeight(1);
    sketch.stroke(150);
    sketch.fill(fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
    sketch.circle(.5 * visRad * Math.cos(val) + xCenter, .5 * visRad * Math.sin(val) + yCenter, circRad);

    //import the svg for the arrow and spin it
    sketch.push();
    sketch.translate(width / 2, height / 2);
    sketch.rotate(val + Math.PI / 2);
    sketch.image(img, -5, -10, 10, 15);
    sketch.pop();
  }
  sketch.sliderInput = () => {
    //these are the vectors that are used to conditionally color the circle.
    //I used vectors because it's easier to lerp between vectors.
    let v1 = sketch.createVector(238, 196, 125);
    let v2 = sketch.createVector(129, 205, 190);

    //this is the vector that holds the lerp value for the circle. don't touch it :)
    let v3 = sketch.createVector(0, 0, 0);
    let lerpVar;

    // console.log(val);

    //add more conditionals if you need to accommodate more checkpoints
    if (val < checkpoint1) {
      fillColor = [v1.x, v1.y, v1.z, 180];
    } else if (checkpoint1 < val && val < checkpoint2) {
      //this is the lerp zone, the difference between checkpoint 1 and 2. Here, the color will fade from color 1 to color 2.
      lerpVar = checkpoint2 - val;
      lerpVar = sketch.map(checkpoint2 - val, 0, (checkpoint2 - checkpoint1), 1, 0);
      v3 = p5.Vector.lerp(v1, v2, lerpVar);
      fillColor = [v3.x, v3.y, v3.z, 180];
      console.log("lerp zone", lerpVar, val);
    } else {
      fillColor = [v2.x, v2.y, v2.z, 180];
    }
  }
}

const s2 = (sketch) => {
  let val2, xCenter, yCenter, visRad, circRad, checkpoint1, checkpoint2;
  let fillColor = [];

  let width = 180;
  let height = 95;
  let img = sketch.loadImage('../img/gauge-center.svg');
  sketch.setup = () => {
    let canvas = sketch.createCanvas(width, height);
    // canvas.id("")
    //val is the value used to determine the position of the circle.
    //>>swap this with the value of incoming data.
    val2 = Math.PI; // Made the switch to use Math.PI

    //making the slider. Remove and swap with incoming data value using val
    slider2 = sketch.createSlider(0, 10, 0, 0.1);
    slider2.position(10, 80);
    slider2.style('width', '150px');
    slider2.input(sketch.sliderInput);

    xCenter = width / 2;
    yCenter = height / 2;

    //the radius of the arc
    visRad = 60;

    //the size of the moving circle
    circRad = 20;

    //where the colors start and end
    checkpoint1 = 4;
    checkpoint2 = 6;

    //the mapping of the moving circle to a semicircle
    valMin = 0;
    valMax = 10;

    //this should be replaced with a function that runs on a time interval to do the same job. The trigger for this is slider interaction at the moment.
    sketch.sliderInput();
  }
  sketch.draw = () => {
    sketch.rectMode(sketch.CENTER);
    val2 = sketch.map(slider2.value(), valMin, valMax, Math.PI, 2 * Math.PI);
    sketch.background(255);

    //the arc that the little circle moves around
    sketch.noFill();
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeWeight(circRad - 3);
    sketch.stroke(220);
    sketch.arc(xCenter, yCenter, visRad, visRad, Math.PI, 2 * Math.PI, sketch.OPEN);

    //make the little circle
    sketch.strokeWeight(1);
    sketch.stroke(150);
    sketch.fill(fillColor[0], fillColor[1], fillColor[2], fillColor[3]);
    sketch.circle(.5 * visRad * Math.cos(val2) + xCenter, .5 * visRad * Math.sin(val2) + yCenter, circRad);

    //import the svg for the arrow and spin it
    sketch.push();
    sketch.translate(width / 2, height / 2);
    sketch.rotate(val2 + Math.PI / 2);
    sketch.image(img, -5, -10, 10, 15);
    sketch.pop();
  }
  sketch.sliderInput = () => {
    //these are the vectors that are used to conditionally color the circle.
    //I used vectors because it's easier to lerp between vectors.
    let v1 = sketch.createVector(238, 196, 125);
    let v2 = sketch.createVector(129, 205, 190);

    //this is the vector that holds the lerp value for the circle. don't touch it :)
    let v3 = sketch.createVector(0, 0, 0);
    let lerpVar;

    // console.log(val);

    //add more conditionals if you need to accommodate more checkpoints
    if (val2 < checkpoint1) {
      fillColor = [v1.x, v1.y, v1.z, 180];
    } else if (checkpoint1 < val2 && val2 < checkpoint2) {
      //this is the lerp zone, the difference between checkpoint 1 and 2. Here, the color will fade from color 1 to color 2.
      lerpVar = checkpoint2 - val2;
      lerpVar = sketch.map(checkpoint2 - val2, 0, (checkpoint2 - checkpoint1), 1, 0);
      v3 = p5.Vector.lerp(v1, v2, lerpVar);
      fillColor = [v3.x, v3.y, v3.z, 180];
      console.log("lerp zone", lerpVar, val2);
    } else {
      fillColor = [v2.x, v2.y, v2.z, 180];
    }
  }
}


new p5(s0, 'temp-canvas');
new p5(s1, 'humidity-canvas');
new p5(s2, 'air-canvas');
