<parent-article>
  <div if={ parentArticle.id }>
    <div class="ui small yellow message">
      <div class="content">
        <span class="description"><raw2 content="{ parentArticle.text }"/>
          <a if={ parentArticle.replyto } class="ui small label"
            href="./id.html#{ parentArticle.replyto }">{ parentArticle.replyto }への返信</a></span>
        <p class="metadata">
          <a href="./id.html#{ parentArticle.id }"><span>ID:{ parentArticle.id } </span>
          { moment(parentArticle.date).format('YYYY-MM-DD HH:mm:ss') }</a>
        </p>
      </div>
    </div>
  </div>

    this.parentArticle = new Object()
    var self = this
    var fetchUrl = './'

    parentReader = function(parentId) {
      if (parentId) {
        fetch(fetchUrl + 'id.json/' + parentId)
        .then(function(res) {
          return res.json()
        }).then(function(json) {
          self.parentArticle = JSON.parse(json)
        }).then(function() {
          self.update()
        })
      } else {
        self.parentArticle = new Object()
        self.update()
      }
    }

    this.on('mount', function() {
      parentReader(self.parentArticle.id)
    })

    el.on('parent', function(parentId) {
      self.parentArticle = new Object()
      parentReader(parentId)
    })

  <style scoped>

    .content .metadata a {
      color: rgba(0,0,0,.6);
      font-size: 85%;
    }

    .content .description {
      font-size: 105%;
      line-height: 2;
      color: rgba(0,0,0,.87);
    }

  </style>

</parent-article>
