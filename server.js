'use strict';

var gpio = require("gpio"),
    express = require('express'),
    app = express(),
    isSwing = false,
    config = require('./etc/config');

var toyBear = gpio.export(config.toyBear.IOPort, {
   direction: 'out',
   ready: function() {
     // перестаем скакать
     toyBear.set(0);
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

app.get('/bear/swing/', function(req, res) {
  swingBear();
  res.send('Lets swing bear!');
});

app.listen(config.web.port);
