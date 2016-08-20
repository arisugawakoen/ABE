<single-article>
  <div if={ result.text.length }>
    <div class="ui relaxed floating message">
      <div class="content">
        <span class="description"><raw2 content={ result.text }/>
          <a if={ result.replyto } class="ui small label"
            href="./id.html#{ result.replyto }">{ result.replyto }への返信</a></span>
        <p class="metadata">
          <a href="./id.html#{ result.id }"><span>ID:{ result.id } </span>
            { moment(result.date).format('YYYY-MM-DD HH:mm:ss') }</a>
        </p>
      </div>
    </div>
  </div>

    this.result = new Object()
    var postId = 0
    var fetchUrl = './'
    var self = this

    single = function(id) {
      if (id !== 0) {
        fetch(fetchUrl + 'id.json/' + id)
        .then(function(res) {
          return res.json()
        }).then(function(json) {
          self.result = JSON.parse(json)
        }).then(function() {
          if (!self.result) self.result = new Object()
          el.trigger('parent', self.result.replyto)
          self.update()
        })
      } else {
        self.result = new Object()
        self.update()
      }
    }

    el.on('url', function(id) {
      id = id || 0
      single(id)
    }) 

    postId = opts.id 
    single(postId)

  <style scoped>

    .content .metadata a {
      color: rgba(0,0,0,.6);
      font-size: 90%;
    }

    .content .description {
      font-size: 105%;
      line-height: 2;
    }

  </style>

</single-article>
