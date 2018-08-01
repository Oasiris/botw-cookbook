console.log('index.js loaded');

let transformStyles = ['-webkit-transform',
  '-ms-transform', 'transform'];

window.randomize = () => {
  let rotation = Math.floor(Math.random() * 360);
  for(let ts of transformStyles) {
    $('.circle .fill').css(ts, `rotate(${rotation}deg)`);
  }
}


// Actual animation upon loading / clicking
setTimeout(window.randomize, 200);
$('.radial-progress').click(window.randomize);
