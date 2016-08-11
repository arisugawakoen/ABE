<single-article>
  <div if={ result }>
    <div class="ui relaxed floating message">
      <div class="content">
        <span class="description"><raw2 content={ result.text }/>
        <a if={ result.replyto } class="ui small label" href="./id.html#{ result.replyto }">{ result.replyto }への返信</a></span>
        <p class="metadata">
          <a href="./id.html#{ result.id }"><span>ID:{ result.id } </span>
          { moment(result.date).format('YYYY-MM-DD HH:mm:ss') }</a>
        </p>
      </div>
    </div>
  </div>

    this.result = new Object()
    var self = this
    var postId = 1
    var fetchUrl = './'

    single = function(id) {
      id = '/' + id || 1
      fetch(fetchUrl + 'id.json' + id)
      .then(function(res) {
        return res.json()
      }).then(function(json) {
        self.result = JSON.parse(json)
      }).then(function() {
        self.update()
      }).then(function() {
        el.trigger('parent', self.result.replyto)
      })
    }

    postId = opts.id || 1    

    el.on('url', function(id) {
      id = id || 1
      single(id)
    }) 

    single(postId)

  <style scoped>

    .content .metadata a {
      color: rgba(0,0,0,.6);
      font-size: 95%;
    }

    .content .description {
      font-size: 115%;
      line-height: 2;
    }

  </style>

</single-article>
