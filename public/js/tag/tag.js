riot.tag2('articles', '<div if="{results.length}"> <div each="{results}"> <div class="ui link relaxed segment" style="margin-bottom: 0.8em;"> <div class="content"> <span class="description"><raw2 content="{text}"></raw2> <a if="{replyto}" class="ui small label" href="http://192.168.56.16/id.html#{replyto}">{replyto}への返信</a></span> <p class="metadata"> <a href="http://192.168.56.16/id.html#{id}"><span>ID:{id} </span> {moment.unix(date.timestamp).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div> <a onclick="{additionalReading}" class="ui fluid button">追加読み込み</a> </div>', 'articles .content .metadata a,[riot-tag="articles"] .content .metadata a,[data-is="articles"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 85%; } articles .content .description,[riot-tag="articles"] .content .description,[data-is="articles"] .content .description{ font-size: 105%; line-height: 2; }', '', function(opts) {

    this.results = []
    var offset = 0
    var limit = 30
    var limitMax = 3000
    var addNumber = 30
    var interval = 10000
    var fetchUrl = 'http://192.168.56.16/'
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

    this.escape_html = function(string) {
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
    }.bind(this)

    this.additionalReading = function() {
      limit += addNumber
      if (limit > limitMax) limit = limitMax
      reloader(offset, limit)
    }.bind(this)

    reloader(offset, limit)
    setInterval(reloader(offset, limit), interval)

});

riot.tag2('parent-article', '<div if="{parentArticle.id}"> <div class="ui small yellow message"> <div class="content"> <span class="description"><raw2 content="{parentArticle.text}"></raw2> <a if="{parentArticle.replyto}" class="ui small label" href="http://192.168.56.16/id.html#{parentArticle.replyto}">{parentArticle.replyto}への返信</a></span> <p class="metadata"> <a href="http://192.168.56.16/id.html#{parentArticle.id}"><span>ID:{parentArticle.id} </span> {moment.unix(parentArticle.date.timestamp).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div>', 'parent-article .content .metadata a,[riot-tag="parent-article"] .content .metadata a,[data-is="parent-article"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 85%; } parent-article .content .description,[riot-tag="parent-article"] .content .description,[data-is="parent-article"] .content .description{ font-size: 105%; line-height: 2; color: rgba(0,0,0,.87); }', '', function(opts) {

    this.parentArticle = new Object()
    var self = this

    parentReader = function(parentId) {
      if (parentId) {
        fetch('http://192.168.56.16/id.json/' + parentId)
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
      console.log(self.parentArticle.id)
      parentReader(self.parentArticle.id)
    })

    el.on('parent', function(parentId) {
      self.parentArticle = new Object()
      parentReader(parentId)
    })

});

riot.tag2('post-action', '<form onsubmit="{add}" class="ui form"> <div class="field"> <textarea name="input" onkeyup="{edit}" rows="3"></textarea> <button __disabled="{!text}" class="fluid ui button">{opts.button}</button> </div> </form>', '', '', function(opts) {

    this.edit = function(e) {
      this.text = e.target.value
    }.bind(this)

    this.add = function(e) {
      var ma = null
      var matchAngle = this.text.match(/<<(\d+)/);
      if (matchAngle) ma = matchAngle[1]
      var replyto = opts.replyto || ma || null

      if (this.text) {
        reply(this.text, replyto)
        this.text = this.input.value = ''
      }
    }.bind(this)

});

riot.tag2('raw', '<span></span>', '', '', function(opts) {

  this.root.innerHTML = opts.content.replace(/\n/g, '<br>')
});

riot.tag2('raw2', '<span></span>', '', '', function(opts) {

    this.on('update', function() {
      this.addAutoLink = function(string) {
        return string.replace(
          /(https?:\/\/[^:/<>&\s]+(?::\d+)?(?:\/[^#\s<>&()"']*(?:#(?:[^\s<>&"'()]+))?)?)|(.)/gi,
          function (all, url, normal) {
            if (url) {
              return '<a href="#" onclick="window.open(\'' + url + '\')">' + url + '</a>'
            } else {
              return normal;
            }
        })
      }.bind(this)

      this.nl2br = function(string) {
        return string.replace(/\n/g, '<br>')
      }.bind(this)

      var cont = opts.content || ''
      cont = this.addAutoLink(cont)
      cont = this.nl2br(cont)
      this.root.innerHTML = cont
    })

});

riot.tag2('reply-articles', '<div if="{results.length}"> <div class="ui small olive message" style="margin: 0;" each="{results}"> <div class="content"> <span class="description"><raw2 content="{text}"></raw2> <a if="{replyto}" class="ui small label" href="http://192.168.56.16/id.html#{replyto}">{replyto}への返信</a></span> <p class="metadata"> <a href="http://192.168.56.16/id.html#{id}"><span>ID:{id} </span> {moment.unix(date.timestamp).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div>', 'reply-articles .content .metadata a,[riot-tag="reply-articles"] .content .metadata a,[data-is="reply-articles"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 85%; } reply-articles .content .description,[riot-tag="reply-articles"] .content .description,[data-is="reply-articles"] .content .description{ font-size: 105%; line-height: 2; color: rgba(0,0,0,.87); }', '', function(opts) {

    this.results = []
    var self = this
    var fetchUrl = 'http://192.168.56.16/'

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

});

riot.tag2('single-article', '<div if="{result}"> <div class="ui relaxed floating message"> <div class="content"> <span class="description"><raw2 content="{result.text}"></raw2> <a if="{result.replyto}" class="ui small label" href="http://192.168.56.16/id.html#{result.replyto}">{result.replyto}への返信</a></span> <p class="metadata"> <a href="http://192.168.56.16/id.html#{result.id}"><span>ID:{result.id} </span> {moment.unix(result.date.timestamp).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div>', 'single-article .content .metadata a,[riot-tag="single-article"] .content .metadata a,[data-is="single-article"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 95%; } single-article .content .description,[riot-tag="single-article"] .content .description,[data-is="single-article"] .content .description{ font-size: 115%; line-height: 2; }', '', function(opts) {

    this.result = new Object()
    var self = this
    var postId = 1
    var fetchUrl = 'http://192.168.56.16/'

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

});

riot.tag2('single-page', '<parent-article></parent-article> <single-article id="{id}"></single-article> <reply-articles replyto="{id}"></reply-articles> <post-action replyto="{id}" button="返信を投稿"></post-action> <a class="ui fluid button" onclick="location.href = \'http://192.168.56.16/article.html\';">投稿一覧</a>', '', '', function(opts) {

  this.id = 1
  var self = this
  var fetchUrl = 'http://192.168.56.16/'
  el = riot.observable()

  riot.route(function(id) {
    self.id = id
    el.trigger('url', id)
  })

  riot.route.start(true)

  reply = function(text, replyto) {
    console.log('reply.replyto: ', replyto)
    fetch(fetchUrl + 'index.json', {
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
      el.trigger('url', self.id)
    })
  }

  this.escape_html = function(string) {
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
  }.bind(this)

});
