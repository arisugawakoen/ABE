<reply-articles>
  <div if={ results.length }>
    <div class="ui small olive message" style="margin: 0;" each={ results }>
      <div class="content">
        <span class="description"><raw2 content="{ text }"/>
          <a if={ replyto } class="ui small label"
            href="./id.html#{ replyto }">{ replyto }への返信</a></span>
        <p class="metadata">
          <a href="./id.html#{ id }"><span>ID:{ id } </span>
            { moment(date).format('YYYY-MM-DD dddd HH:mm:ss') }</a>
        </p>
      </div>
    </div>
  </div>

    this.results = []
    var self = this
    var fetchUrl = './'

    replyArticles = function(replyto) {
      fetch(fetchUrl + 'reply.json/' + replyto)
      .then(function(res) {
        return res.json()
      }).then(function(json) {
        self.results = JSON.parse(json)
      }).then(function() {
        self.update()
      })
    }

    el.on('url', function(id) {
      if(id) replyArticles(id)
    })

    if (opts.replyto) replyArticles(opts.replyto)

  <style scoped>

    .content {
      word-wrap:break-word;
    }

    .content .metadata a {
      color: rgba(0,0,0,.6);
      font-size: 85%;
    }

    .content .description {
      font-size: 105%;
      line-height: 1.8;
      color: rgba(0,0,0,.87);
    }

  </style>

</reply-articles>
