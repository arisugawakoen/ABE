<raw2>
  <span></span>

    this.on('update', function() {
      addAutoLink(string) {
        return string.replace(
          /(https?:\/\/[^:/<>&\s]+(?::\d+)?(?:\/[^#\s<>&()"']*(?:#(?:[^\s<>&"'()]+))?)?)|(.)/gi,
          function (all, url, normal) {
            if (url) {
              return '<a href="#" onclick="window.open(\'' + url + '\')">' + url + '</a>'
            } else {
              return normal;
            }
        })
      }

      nl2br(string) {
        return string.replace(/\n/g, '<br>')
      }

      var cont = opts.content || ''
      cont = this.addAutoLink(cont)
      cont = this.nl2br(cont)
      this.root.innerHTML = cont
    })

</raw2>
