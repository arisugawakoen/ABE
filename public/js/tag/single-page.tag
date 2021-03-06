<single-page>

  <parent-article></parent-article>
  <single-article id="{ id }"></single-article>
  <reply-articles replyto="{ id }"></reply-articles>
  <post-action replyto="{ id }" button="返信を投稿"></post-action>
  <a class="ui fluid button" href="./article.html">投稿一覧</a>

    this.id = 0
    var self = this
    var fetchUrl = './'
    el = riot.observable()

    riot.route(function(id) {
      self.id = id
      el.trigger('url', id)
    })

    riot.route.start(true)

    reply = function(text, replyto, color) {
      fetch(fetchUrl + 'index.json', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: self.escape_html(text),
          replyto: replyto,
          color: self.escape_html(color)
        })
      }).then(function() {
        el.trigger('url', self.id)
      })
    }

    escape_html(string) {
      if(typeof string !== 'string') {
        return string;
      }
      return string.replace(/[&'`"<>]/g, function(match) {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;',
        }[match]
      });
    }

</single-page>
