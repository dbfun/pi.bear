'use strict';

var gpio = require("gpio"),
    TelegramBot = require('node-telegram-bot-api'),
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

function app() {
  var bot = new TelegramBot(config.telegram.token, { polling: true });

  bot.onText(/\/start/, function (msg) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Список команд:\n" +
      "/start - эта справочная информация\n" +
      "/swing - начать раскачивать медведя\n" +
      "/blink - начать мигать грибами"
    );
  });

  bot.onText(/\/swing/, function (msg) {
    var chatId = msg.chat.id;
    swingBear();
    bot.sendMessage(chatId, 'Lets swing bear!');
  });

  bot.onText(/\/blink/, function (msg) {
    var chatId = msg.chat.id;
    blinkMushrooms();
    bot.sendMessage(chatId, 'Lets blink mushrooms!');
  });

}

app();
