<search-page>

  <search-action></search-action>

  <p></p>

  <div if={ results.length }>
    <div class="ui small orange message" style="margin: 0;" each={ results }>
      <div class="content">
        <span class="description"><raw2 content="{ text }"/>
          <a if={ replyto } class="ui small label"
            href="./id.html#{ replyto }">{ replyto }への返信</a></span>
        <p class="metadata">
          <a href="./id.html#{ id }"><span>ID:{ id } </span>
            { moment(date).format('YYYY-MM-DD HH:mm:ss') }</a>
        </p>
      </div>
    </div>
  </div>

  results = []
  var fetchUrl = ''
  var self = this
  el = riot.observable()

  search = function(text) {
    var searchPage = 'http://' + location.host + fetchUrl + '/search.json'
    var searchUrl = new URL(searchPage)
    searchUrl.searchParams.append('q', text)

    fetch(searchUrl)
    .then(function(res) {
      return res.json()
    }).then(function(json) {
      self.results = JSON.parse(json)
    }).then(function() {
      self.update()
    })
  }

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

</search-page>
