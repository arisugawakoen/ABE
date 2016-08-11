<articles>
  <div if={ results.length }>
    <div each={ results }>
      <div class="ui link relaxed segment" style="margin-bottom: 0.8em;">
        <div class="content">
        <span class="description"><raw2 content="{ text }"/>
        <a if={ replyto } class="ui small label" href="./id.html#{ replyto }">{ replyto }への返信</a></span>
        <p class="metadata">
          <a href="./id.html#{ id }"><span>ID:{ id } </span>
          { moment(date).format('YYYY-MM-DD HH:mm:ss') }</a>
        </p>
        </div>
      </div>
    </div>
    <a onclick={ additionalReading } class="ui fluid button">追加読み込み</a>
  </div>

    this.results = []
    var offset = 0
    var limit = 30
    var limitMax = 3000
    var addNumber = 30
    var interval = 1000
    var fetchUrl = './'
    var self = this

    reloader = function(offset, limit) {
      offset = '/' + offset || ''
      limit = '/' + limit || ''
      fetch(fetchUrl + 'index.json' + offset + limit)
      .then(function(res) {
        return res.json()
      }).then(function(json) {
        self.results = JSON.parse(json)
      }).then(function() {
        console.log('date: ', self.results)
        self.update()
      })
    }

    reply = function(text, replyto) {
      fetch(fetchUrl + 'index.json',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: self.escape_html(text),
          replyto: replyto
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

    reloader(offset, limit)
    setInterval(reloader(offset, limit), interval)

  <style scoped>

    .content .metadata a {
      color: rgba(0,0,0,.6);
      font-size: 85%;
    }

    .content .description {
      font-size: 105%;
      line-height: 2;
    }

  </style>

</articles>