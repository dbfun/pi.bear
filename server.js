'use strict';

var gpio = require("gpio"),
    express = require('express'),
    app = express(),
    isSwing = false,
    isBlink = false,
    config = require('./etc/config');

var toyBear = gpio.export(config.toyBear.IOPort, {
   direction: 'out',
   ready: function() {
     // перестаем скакать
     toyBear.set(0);
   }
});

var toyMushroomLeft = gpio.export(config.toyMushrooms.leftIOPort, {
   direction: 'out',
   ready: function() {
     // перестаем скакать
     toyMushroomLeft.set(0);
   }
});

var toyMushroomRight = gpio.export(config.toyMushrooms.rightIOPort, {
   direction: 'out',
   ready: function() {
     // перестаем скакать
     toyMushroomRight.set(0);
   }
});

// Запускаем качание на некоторое время
function swingBear() {
  if(isSwing) return;
  isSwing = true;

  toyBear.set(1);
  setTimeout(function(){
    toyBear.set(0);
    isSwing = false;
  }, config.toyBear.swingDuration);
}

// Мигание грибами
function blinkMushrooms() {
  if(isBlink) return;
  isBlink = true;
  var status = 1;


  var timer = setInterval(function(){
    status = 1 - status;
    toyMushroomLeft.set(status);
    toyMushroomRight.set(1 - status);
  }, 250);

  setTimeout(function(){
    clearInterval(timer);
    toyMushroomLeft.set(0);
    toyMushroomRight.set(0);
    isBlink = false;
  }, config.toyMushrooms.blinkDuration);
}

app.get('/bear/swing/', function(req, res) {
  swingBear();
  blinkMushrooms();
  res.send('Lets swing bear!');
});

app.listen(config.web.port);
