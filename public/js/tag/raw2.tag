<raw2>
  <span></span>

    this.on('update', function() {
      amp2amp(string) {
        return string.replace(/&amp;/g,'&')
      }

      addAutoLink(string) {
        return string.replace(
          /(^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$)/gi,
          function (all, url, normal) {
            if (url) {
              return '<a href="' + url + '" target="_blank">' + url + '</a>'
            } else {
              return normal;
            }
          }
        )
      }

      nl2br(string) {
        return string.replace(/\n/g, '<br>')
      }

      hashtag(string) {
        return string.replace(/(\*[a-zA-Z0-9]+)/g,
          '<a href="./search.html?q=$1" target="_blank">$1</a>')
      }

      var cont = opts.content || ''
      cont = this.amp2amp(cont)
      cont = this.addAutoLink(cont)
      cont = this.nl2br(cont)
      cont = this.hashtag(cont)

      this.root.innerHTML = cont
    })

</raw2>
