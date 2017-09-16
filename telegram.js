'use strict';

var gpio = require("gpio"),
    TelegramBot = require('node-telegram-bot-api'),
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

function app() {
  var bot = new TelegramBot(config.telegram.token, { polling: true });

  bot.onText(/\/start/, function (msg) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Список команд:\n" +
      "/start - эта справочная информация\n" +
      "/swing - начать раскачивать медведя"
    );
  });

  bot.onText(/\/swing/, function (msg) {
    var chatId = msg.chat.id;
    swingBear();
    bot.sendMessage(chatId, 'Lets swing bear!');
  });

}

app();
