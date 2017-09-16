# Описание

Уведомление о получении новой почты: раскачивание игрушечного медведя.

![Swing bear](https://github.com/dbfun/pi.bear/raw/master/ezgif.com-optimize.gif)

# Доработка MS OWA

В веб-интерфейсе `MS OWA` при поступлении почты показывается количество непрочинанных сообщений. Необходимо подключить `jQuery`, а эту цифру возможно получить так:

```
$('.subfolders[role="group"] [title="Входящие"]').siblings().find('[aria-hidden="true"]').html();
```

Теперь возможно написать задание, которое будет вызывать действие при поступлении новых писем. Для этого необходимо на странице `MS OWA` внедрить следующий код, либо через консоль, либо на постоянной основе с помощью [Персонализированный Веб](https://chrome.google.com/webstore/detail/personalized-web/plcnnpdmhobdfbponjpedobekiogmbco) - необходимо разместить в "Добавлять HTML":

```
<script
  src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
  integrity="sha256-k2WSCIexGzOj3Euiig+TlR8gA0EmPjuc79OEeY5L45g="
  crossorigin="anonymous">
</script>

<script>
console.info('Notify mail service loaded');
setInterval(function(){
  var $incoming = $('.subfolders[role="group"] [title="Входящие"]');
  if(!$incoming.length) return;

  var $incCount = $incoming.siblings().find('[aria-hidden="true"]');
  if(!$incCount.length) return;

  var incCount = parseInt($incCount.text());
  if(incCount > 0) {
    console.log('New incoming message');
    // Так как блокируется "mixed content", используем такой "хак" (вызывает Warning, но реально работает):
    (function(){
        var i = document.createElement('img');
        i.style.display = 'none';
        i.onload = function() { i.parentNode.removeChild(i); };
        i.src = "http://192.168.0.8:80/bear/swing/";
        document.body.appendChild(i);
    })();
  }
}, 1000);
</script>
```

Таким образом, когда число непрочитанных сообщений > `0`, отсылается запрос на `http://192.168.0.8:80/bear/swing/` (этот адрес следует заменить на свой).

# Серверная логика

Работает на `OrangePi` + `nodeJS`. Порядок таков:

Загрузить необходимые модули: `npm install`, скопировать и поправить конфигурацию: `etc.dist` в `etc`: `cp -R etc.dist etc`, `vim etc/config.json`. Запустить веб-сервер: `sudo node server.js` или `sudo pm2 start server.js`.

Также возможно раскачать через бота телеграм, для этого необходимо создать бота и прописать его токен в конфигурацию. Затем запустить бота: `sudo node telegram.js` или `sudo pm2 start telegram.js`. Команда для раскачивания: `/swing`.
