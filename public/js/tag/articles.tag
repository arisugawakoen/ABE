<articles>
  <div if={ results.length }>
    <div each={ results }>
      <div class="ui { color } inverted link relaxed segment"
       style="margin-bottom: 0.8em;" if={ color } >
        <div class="content">
          <span class="description"><raw2 content="{ text }"></raw2>
            <a if={ replyto } class="ui small label" style="color: rgba(0,0,0,.6);" href="./id.html#{ replyto }">{ replyto }への返信</a></span>
          <p class="metadata">
            <a href="./id.html#{ id }"><span>ID:{ id } </span>
            { moment(date).format('YYYY-MM-DD dddd HH:mm:ss') }</a>
          </p>
        </div>
      </div>
      <div class="ui link relaxed segment"
       style="margin-bottom: 0.8em;" if={ !color }>
        <div class="content">
          <span class="description"><raw2 content="{ text }"></raw2>
            <a if={ replyto } class="ui small label" href="./id.html#{ replyto }">{ replyto }への返信</a></span>
          <p class="metadata">
            <a href="./id.html#{ id }"><span>ID:{ id } </span>
            { moment(date).format('YYYY-MM-DD dddd HH:mm:ss') }</a>
          </p>
        </div>
      </div>
    </div>
    <a onclick={ additionalReading } class="ui fluid button">追加読み込み</a>
  </div>

    var results = []
    var fetchUrl = './'
    var offset = 0
    var limit = 50
    var limitMax = 30000
    var addNumber = 50
    var interval = 10000
    var self = this

    reloader = function(offset, limit) {
      offset = '/' + offset || '/0'
      limit = '/' + limit || '/30'
      fetch(fetchUrl + 'index.json' + offset + limit)
      .then(function(res) {
        return res.json()
      }).then(function(json) {
        self.results = JSON.parse(json)
      }).then(function() {
        self.update()
      })
    }

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
        reloader(offset, limit)
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
      })
    }

    additionalReading() {
      limit += addNumber
      if (limit > limitMax) limit = limitMax
      reloader(offset, limit)
    }

    intervalReloader() {
      reloader(offset, limit)
    }

    reloader(offset, limit)
    setInterval(this.intervalReloader, interval)

  <style scoped>

    .content .metadata a {
      color: rgba(0,0,0,.6);
      font-size: 85%;
    }

    .inverted .content .metadata a {
      color: rgba(255,255,255,.6);
    }

    .inverted .content .description a {
      color: rgba(255,255,255,.8);
    }

    .content .description {
      font-size: 105%;
      line-height: 2;
    }

  </style>

</articles>
