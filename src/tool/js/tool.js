
var toolMap = $('.tool-wrapper');
var content = $(toolMap).find('.tool-content');

var scrubber = document.getElementById('scrubber');

scrubber.addEventListener('mousedown', function(evt) {
  document.addEventListener('mousemove', setHeight, false);
}, false);

document.addEventListener('mouseup', function(evt) {
  document.removeEventListener('mousemove', setHeight, false);
}, false);

function setHeight(evt) {
  var y = evt.clientY;
  var map = $('#interactive-map');
  var toneMap = $('#tone-map');
  if(evt.clientY < 15) {
    $(toolMap).css('height', 0);
    $(content).css('height', 0);
  }  else {
    $(toolMap).css('height', y);
    $(content).css('height', y);
  }
  $(map).css('height', window.innerHeight - evt.clientY);
  $(toneMap).css('height', window.innerHeight - evt.clientY);
  // console.log('window.screenY',);
}
