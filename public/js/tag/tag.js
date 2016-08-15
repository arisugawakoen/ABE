riot.tag2('articles', '<div if="{results.length}"> <div each="{results}"> <div class="ui link relaxed segment" style="margin-bottom: 0.8em;"> <div class="content"> <span class="description"><raw2 content="{text}"></raw2> <a if="{replyto}" class="ui small label" href="./id.html#{replyto}">{replyto}への返信</a></span> <p class="metadata"> <a href="./id.html#{id}"><span>ID:{id} </span> {moment(date).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div> <a onclick="{additionalReading}" class="ui fluid button">追加読み込み</a> </div>', 'articles .content .metadata a,[riot-tag="articles"] .content .metadata a,[data-is="articles"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 85%; } articles .content .description,[riot-tag="articles"] .content .description,[data-is="articles"] .content .description{ font-size: 105%; line-height: 2; }', '', function(opts) {

    this.results = []
    var fetchUrl = './'
    var offset = 0
    var limit = 30
    var limitMax = 3000
    var addNumber = 30
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

    reply = function(text, replyto) {
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

    this.intervalReloader = function() {
      reloader(offset, limit)
    }.bind(this)

    reloader(offset, limit)
    setInterval(this.intervalReloader, interval)

});

riot.tag2('parent-article', '<div if="{parentArticle.id}"> <div class="ui small yellow message"> <div class="content"> <span class="description"><raw2 content="{parentArticle.text}"></raw2> <a if="{parentArticle.replyto}" class="ui small label" href="./id.html#{parentArticle.replyto}">{parentArticle.replyto}への返信</a></span> <p class="metadata"> <a href="./id.html#{parentArticle.id}"><span>ID:{parentArticle.id} </span> {moment(parentArticle.date).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div>', 'parent-article .content .metadata a,[riot-tag="parent-article"] .content .metadata a,[data-is="parent-article"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 85%; } parent-article .content .description,[riot-tag="parent-article"] .content .description,[data-is="parent-article"] .content .description{ font-size: 105%; line-height: 2; color: rgba(0,0,0,.87); }', '', function(opts) {

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

});

riot.tag2('post-action', '<form onsubmit="{add}" class="ui form"> <div class="field"> <textarea name="input" onkeyup="{edit}" rows="4"></textarea> <button __disabled="{!text}" class="fluid ui button">{opts.button}</button> </div> </form>', '', '', function(opts) {

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
          }
        )
      }.bind(this)

      this.nl2br = function(string) {
        return string.replace(/\n/g, '<br>')
      }.bind(this)

      this.hashtag = function(string) {
        return string.replace(/(\*[a-zA-Z0-9]+)/g,
          '<a href="#" onclick="window.open(\'./search.html?q=$1\')">$1</a>')
      }.bind(this)

      var cont = opts.content || ''
      cont = this.addAutoLink(cont)
      cont = this.nl2br(cont)
      cont = this.hashtag(cont)

      this.root.innerHTML = cont
    })

});

riot.tag2('reply-articles', '<div if="{results.length}"> <div class="ui small olive message" style="margin: 0;" each="{results}"> <div class="content"> <span class="description"><raw2 content="{text}"></raw2> <a if="{replyto}" class="ui small label" href="./id.html#{replyto}">{replyto}への返信</a></span> <p class="metadata"> <a href="./id.html#{id}"><span>ID:{id} </span> {moment(date).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div>', 'reply-articles .content .metadata a,[riot-tag="reply-articles"] .content .metadata a,[data-is="reply-articles"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 85%; } reply-articles .content .description,[riot-tag="reply-articles"] .content .description,[data-is="reply-articles"] .content .description{ font-size: 105%; line-height: 2; color: rgba(0,0,0,.87); }', '', function(opts) {

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

});

riot.tag2('search-action', '<form onsubmit="{ask}" class="ui fluid icon input"> <input type="text" placeholder="Search..." name="input" onkeyup="{edit}"> <button __disabled="{!text}" class="ui button">検索</button> </form>', '', '', function(opts) {

    if (opts.query) this.input.value = opts.query

    this.edit = function(e) {
      this.text = e.target.value
    }.bind(this)

    this.ask = function(e) {
      if (this.text) {
        search(this.text)
      }
    }.bind(this)

});

riot.tag2('search-page', '<search-action query="{urlQuery}"></search-action> <p></p> <div if="{results.length}"> <div class="ui small orange message" each="{results}"> <div class="content"> <span class="description"><raw2 content="{text}"></raw2> <a if="{replyto}" class="ui small label" href="./id.html#{replyto}">{replyto}への返信</a></span> <p class="metadata"> <a href="./id.html#{id}"><span>ID:{id} </span> {moment(date).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div> <div if="{!isResult}"> <div class="ui small negative message"> <div class="header"> 検索結果なし </div> <p> 別のキーワードで検索してください </p> </div> </div> <a class="ui fluid button" onclick="location.href = \'./article.html\';">投稿一覧</a>', 'search-page .content .metadata a,[riot-tag="search-page"] .content .metadata a,[data-is="search-page"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 85%; } search-page .content .description,[riot-tag="search-page"] .content .description,[data-is="search-page"] .content .description{ font-size: 105%; line-height: 2; color: rgba(0,0,0,.87); }', '', function(opts) {

  results = []
  isResult = true
  var fetchUrl = ''
  var self = this

  var hash = location.search.substring(1).split('&')
  var vars = {}
  hash.forEach(function(element) {
    var z = element.split('=', 2)
    vars[z[0]] = decodeURIComponent(z[1])
  })
  urlQuery = vars['q']

  search = function(text) {
    var searchPage = 'http://' + location.host + fetchUrl + '/search.json'
    var searchUrl = new URL(searchPage)
    var encodeQuery = encodeURIComponent(text)
    searchUrl += '?q=' + encodeQuery

    fetch(searchUrl)
    .then(function(res) {
      return res.json()
    }).then(function(json) {
      self.results = JSON.parse(json)
    }).then(function() {
      self.isResult = (self.results.length) ? true : false
      self.update()
    })
  }

  if (urlQuery) search(urlQuery)

});

riot.tag2('single-article', '<div if="{result.text.length}"> <div class="ui relaxed floating message"> <div class="content"> <span class="description"><raw2 content="{result.text}"></raw2> <a if="{result.replyto}" class="ui small label" href="./id.html#{result.replyto}">{result.replyto}への返信</a></span> <p class="metadata"> <a href="./id.html#{result.id}"><span>ID:{result.id} </span> {moment(result.date).format(\'YYYY-MM-DD HH:mm:ss\')}</a> </p> </div> </div> </div>', 'single-article .content .metadata a,[riot-tag="single-article"] .content .metadata a,[data-is="single-article"] .content .metadata a{ color: rgba(0,0,0,.6); font-size: 95%; } single-article .content .description,[riot-tag="single-article"] .content .description,[data-is="single-article"] .content .description{ font-size: 115%; line-height: 2; }', '', function(opts) {

    this.result = new Object()
    var postId = 1
    var fetchUrl = './'
    var self = this

    single = function(id) {
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
    }

    el.on('url', function(id) {
      id = id || 1
      single(id)
    })

    postId = opts.id || 1
    single(postId)

});

riot.tag2('single-page', '<parent-article></parent-article> <single-article id="{id}"></single-article> <reply-articles replyto="{id}"></reply-articles> <post-action replyto="{id}" button="返信を投稿"></post-action> <a class="ui fluid button" onclick="location.href = \'./article.html\';">投稿一覧</a>', '', '', function(opts) {

  this.id = 1
  var self = this
  var fetchUrl = './'
  el = riot.observable()

  riot.route(function(id) {
    self.id = id
    el.trigger('url', id)
  })

  riot.route.start(true)

  reply = function(text, replyto) {
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