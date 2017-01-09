
var toolMap = $('.tool-wrapper');
var content = $(toolMap).find('.tool-content');

var scrubber = document.getElementById('scrubber');
var map = $('#interactive-map');
var offset = 16;

scrubber.addEventListener('mousedown', function(evt) {
  document.addEventListener('mousemove', setHeight, false);
}, false);

document.addEventListener('mouseup', function(evt) {
  document.removeEventListener('mousemove', setHeight, false);
}, false);

$(function() {
  $('#scrubber').css('bottom', map.height() - offset);
});

function setHeight(evt) {
  var y = evt.clientY;
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
  $('#scrubber').css('bottom', map.height() - offset);
  // console.log('window.screenY',);
}
