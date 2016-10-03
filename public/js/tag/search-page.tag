<search-page>

  <search-action query={ urlQuery }></search-action>

  <p></p>

  <div if={ results.length }>
    <div class="ui small orange message" each={ results }>
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

  <div if={!isResult }>
    <div class="ui small negative message">
      <div class="header">
        検索結果なし
      </div>
      <p>
        別のキーワードで検索してください
      </p>
    </div>
  </div>

  <a class="ui fluid button" href="./article.html">投稿一覧</a>

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
    var searchPage = ['http://', location.host, fetchUrl, '/search.json'].join("")
    var searchUrl = new URL(searchPage)
    var encodeQuery = encodeURIComponent(text)
    searchUrl = [searchUrl, '?q=', encodeQuery].join("")

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

</search-page>
