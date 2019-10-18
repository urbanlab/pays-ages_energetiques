/*eslint no-undef: 0*/

const socket = io();

const id = parseInt((new URL(document.location)).searchParams.get('id')) || 0;
const key = [
  'eolien',
  'consommation_elec',
  'biomasse',
  'consommation_gaz',
  'hydro',
  'solaire',
][id];

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
    vec3 rgb = hsv2rgb(vec3(hsv.x, hsv.y * (1.0 + u_fx * 10.0), hsv.z * (1.0 - u_fx)));

    return rgb;
}

vec3 negatif(vec2 st) {
  vec3 original = texture2D(u_tex, st).xyz;
  vec3 c = 1.0 - texture2D(u_tex, st).xyz;
  return mix(original, c, u_fx);
}

vec3 desat(vec2 st) {
    vec4 c = texture2D(u_tex, st);    
    vec3 hsv = rgb2hsv(c.rgb);
    vec3 rgb = hsv2rgb(vec3(hsv.x, hsv.y * (1.0 - u_fx), hsv.z * (1.0 + u_fx)));

    return rgb;
}

vec3 effect3(vec2 st) {
    vec4 c = texture2D(u_tex, st);    
    vec3 hsv = rgb2hsv(c.rgb);
    vec3 rgb = hsv2rgb(vec3(hsv.x, hsv.y * (1.0 + u_fx * 20.0), hsv.z));

    return rgb;
}

vec3 bruit(vec2 st) {
    vec4 c = texture2D(u_tex, st);
    float r = length(texture2D(u_random, st).rgb)/1.5;
    vec3 rgb = c.xyz + (r - 0.5) * u_fx * 2.;
    return rgb;
}

vec3 traits(vec2 st) {
    vec2 texCoord = st;
    texCoord.y += (texture2D(u_random, vec2(st.x, 0.5)).r - 0.5) / 3. * u_fx;
    vec3 c = texture2D(u_tex, texCoord).rgb;
    return c;
}

vec3 flou(vec2 st) {
  float n = 0.;
  vec3 c = vec3(0.);

  for(float y = -2.; y <= 2.; y += 0.5){
    for(float x = -1.; x <= 1.; x += 0.2){
      float s = u_fx/100.;
      c += texture2D(u_tex, st + vec2(x * s, y * s)).rgb;
      n += 1.;
    }
  }

  return c/n;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.y = 1.0 - st.y;

    st -= 0.5;
    st *= 0.9;
    st += 0.5;

    vec3 c = 
        u_id == 0. ? desat(st) :
        u_id == 1. ? bruit(st) :
        u_id == 2. ? traits(st) :
        u_id == 3. ? flou(st) :
        u_id == 4. ? negatif(st) :
        solarize(st);

    gl_FragColor = vec4(c, u_alpha);
}
`;

let img, myShader;
let cx = 0;
let cy = 0;
let touchX = 0;
let touchY = 0;

var params = {
  alpha: 0,
  fx: data[imageID][key][year]
};

function createRandom(img) {
  const pg = createGraphics(width, height);
  pg.imageMode(CENTER);
  pg.push();
  pg.translate(width / 2, height / 2);
  pg.scale(img.height > img.width ? width / img.width : height / img.height);
  pg.image(img, 0, 0);
  pg.pop();

  console.log('create random texture')
  let seed = random(1000);
  myShader.setUniform('u_seed', seed);
  myShader.setUniform('u_random', pg);
}

function onImgLoad(img) {
  const pg = createGraphics(width, height);
  pg.imageMode(CENTER);
  pg.push();
  pg.translate(width / 2, height / 2);
  pg.scale(img.height > img.width ? width / img.width : height / img.height);
  pg.image(img, 0, 0);
  pg.pop();

  console.log('create texture')
  let seed = random(1000);
  myShader.setUniform('u_seed', seed);
  myShader.setUniform('u_tex', pg);

  TweenMax.fromTo(params, 2, { alpha: 0, fx: 0 }, {
    alpha: 1,
    ease: Power4.easeInOut,
    delay: 3 + (2 + 3) * id 
  });

  TweenMax.fromTo(params, 3, { fx: 0 }, {
    fx: data[imageID][key][year],
    ease: Power4.easeInOut,
    delay: (2 + 3) * (id + 1)
  });
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    pixelDensity(1);
    noStroke();

    // create and initialize the shader
    myShader = createShader(vertexShader, fragmentShader);
    shader(myShader);
  
    myShader.setUniform('u_resolution', [width, height]);
    myShader.setUniform('u_id', id);
  
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
      fx: mouseX/width
    })
    socket.emit('mouse', { x: mouseX/width, y: mouseY/height })
}*/

// FULLSCREEN
/*
function mouseClicked(){
  fullscreen(!fullscreen());
  return false;
}
*/

///////////////////////////////////////////////
// SOCKET.IO

socket.on('start', () => {
  console.log('start');
  
  TweenMax.to(params, 3, {
    alpha: 1,
    ease: Power4.easeInOut,
  }, 3);
});

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

socket.on('mouse', data => {
  touchX = data.x;
  touchY = data.y;
});
