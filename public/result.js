/*eslint no-undef: 0*/

const socket = io();

const keys = [
  'eolien',
  'consommation_elec',
  'biomasse',
  'consommation_gaz',
  'hydro',
  'solaire',
];

let imageID = 0;
let imgUrl = data[imageID].url;

let year = 0;

const vertexShader = `
#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;

void main() { 
    gl_Position = vec4(aPosition, 1.0); 
}
`;

const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float u_id;
uniform float u_alpha;
uniform float u_fx;
uniform float u_fx0;
uniform float u_fx1;
uniform float u_fx2;
uniform float u_fx3;
uniform float u_fx4;
uniform float u_fx5;
uniform sampler2D u_tex;
uniform sampler2D u_random;

float random(vec2 st) {
   return fract(sin(texture2D(u_random, st).r * 43758.5453123)) - 0.03;
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float map(float value, float aMin, float aMax, float bMin, float bMax) {
  return bMin + (bMax - bMin) * (value - aMin) / (aMax - aMin);
}

vec3 solarize(vec2 st) {
    vec4 c = texture2D(u_tex, st);    
    vec3 hsv = rgb2hsv(c.rgb);
    vec3 rgb = hsv2rgb(vec3(hsv.x, hsv.y * (1.0 + u_fx5 * 10.0), hsv.z));

    return rgb;
}

vec3 negatif(vec2 st) {
  vec3 original = texture2D(u_tex, st).xyz;
  vec3 c = 1.0 - texture2D(u_tex, st).xyz;
  return mix(original, c, u_fx4);
}



vec3 getColor(vec2 st) {
  // traits
  st.y += (texture2D(u_random, vec2(st.x, 0.5)).r - 0.5) / 4. * u_fx2;

  vec3 original = texture2D(u_tex, st).rgb;

  vec3 c = vec3(0.);
  vec3 hsv = rgb2hsv(original);

  // desat
  c = hsv;
  c.y *= 1.0 - u_fx0;
  c = hsv2rgb(vec3(hsv));

  //bruit
  float r = length(texture2D(u_random, st).rgb)/1.5;
  c += (r - 0.5) * u_fx1 * 2.;


  //vec3 solarize = hsv;
  hsv = rgb2hsv(c);
  c = hsv2rgb(vec3(hsv.x, hsv.y * (1.0 + u_fx5 * 10.0), hsv.z));

  return c;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.y = 1.0 - st.y;

  // blur    
  float n = 0.;
  vec3 c = vec3(0.);
  c += getColor(st);
  /*
  for(float y = -4.; y <= 4.; y += 0.5){
    for(float x = -1.; x <= 1.; x += 0.1){
      float s = u_fx3/100.;
      c += getColor(st + vec2(x * s, y * s));
      n += 1.;
    }
  }
  c /= n;
*/
  
  //vec3 c2 = 1.0 - c;
  //c = mix(c, c2, u_fx4);
  

  gl_FragColor = vec4(c, u_alpha);
}
`;

let img, myShader;
let cx = 0;
let cy = 0;
let touchX = 0;
let touchY = 0;

var params = {
  alpha: 1,
  fx: 0,
  fx0: 0,
  fx1: 0,
  fx2: 0,
  fx3: 0,
  fx4: 0,
  fx5: 0
};

function createRandom(img) {
  const pg = createGraphics(width, height);
  pg.push();
  pg.image(img, 0, 0, width, height);
  pg.pop();

  console.log('create random texture')
  let seed = random(1000);
  myShader.setUniform('u_seed', seed);
  myShader.setUniform('u_random', pg);
}

function onImgLoad(img) {
  const pg = createGraphics(width, height);
  //pg.imageMode(CENTER);
  pg.push();
  //pg.translate(width / 2, height / 2);
  //pg.scale(img.height > img.width ? width / img.width : height / img.height);
  pg.image(img, 0, 0, width, height);
  pg.pop();

  console.log('create texture')
  let seed = random(1000);
  myShader.setUniform('u_seed', seed);
  myShader.setUniform('u_tex', pg);
  
  TweenMax.fromTo(params, 3, {
    alpha: 0
  }, {
    alpha: 1,
    delay: 3
  });
  
  TweenMax.fromTo(params, 20, {
    fx: 0,
    fx0: 0,
    fx1: 0,
    fx2: 0,
    fx3: 0,
    fx4: 0,
    fx5: 0,
  },{
    fx: 1,
    fx0: data[imageID][keys[0]][year],
    fx1: data[imageID][keys[1]][year],
    fx2: data[imageID][keys[2]][year],
    fx3: data[imageID][keys[3]][year],
    fx4: data[imageID][keys[4]][year],
    fx5: data[imageID][keys[5]][year],
    delay: 8
  })
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    pixelDensity(1);
    noStroke();

    // create and initialize the shader
    myShader = createShader(vertexShader, fragmentShader);
    shader(myShader);
  
    myShader.setUniform('u_resolution', [width, height]);
    myShader.setUniform('u_id', 0);
  
    loadImage('https://cdn.glitch.com/ecfa8186-2fb0-48f1-b6cf-dae89c7003cf%2Frandom.png?v=1571215970558', createRandom);
  
    img = loadImage(imgUrl, onImgLoad);
}

function draw() {
    cx = lerp(cx, touchX, 0.05);
    cy = lerp(cy, touchY, 0.05);
    myShader.setUniform('u_mouse', [cx / width, cy / height]);
    myShader.setUniform('u_time', millis() / 1000.);
  
    myShader.setUniform('u_alpha', params.alpha);
    myShader.setUniform('u_fx', params.fx);
    myShader.setUniform('u_fx0', params.fx0);
    myShader.setUniform('u_fx1', params.fx1);
    myShader.setUniform('u_fx2', params.fx2);
    myShader.setUniform('u_fx3', params.fx3);
    myShader.setUniform('u_fx4', params.fx4);
    myShader.setUniform('u_fx5', params.fx5);
    quad(-1,-1, -1,1, 1,1, 1,-1);
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    myShader.setUniform('u_resolution', [width, height]);
}
/*
function mousePressed() {
    TweenMax.killAll();
    TweenMax.to(params, 1, {
      fx: mouseX/width,
      fx0: mouseX/width,
      fx1: mouseX/width,
      fx2: mouseX/width,
      fx3: mouseX/width,
      fx4: mouseX/width,
      fx5: mouseX/width,
    })
    socket.emit('mouse', { x: mouseX/width, y: mouseY/height })
}*/

// FULLSCREEN
function mouseClicked(){
  fullscreen(!fullscreen());
  return false;
}


///////////////////////////////////////////////
// SOCKET.IO

socket.on('image', d => {
  console.log('image', d);
  TweenMax.killAll();
  
  TweenMax.to(params, 1, {
    alpha: 0,
    onComplete: () => {
      loadImage('https://cdn.glitch.com/ecfa8186-2fb0-48f1-b6cf-dae89c7003cf%2Frandom.png?v=1571215970558', createRandom);
      imageID = d.imageID;
      imgUrl = data[imageID].url;
      loadImage(imgUrl, onImgLoad);
      params.fx = 0;
    }
  });
});

socket.on('year', d => {
  console.log('year', d);
  
  year = d.year;
  console.log('fx', data[imageID][key][year]);
  
  TweenMax.to(params, 1, {
    fx: data[imageID][key][year],
    ease: Power4.easeInOut,
  });
});
