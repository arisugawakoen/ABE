<post-action>
  <form onsubmit={ add } class="ui form">
    <div class="field">
      <textarea name="input" onkeyup={ edit } rows="5"></textarea>
      <button disabled={ !text }
        class="fluid ui button">{ opts.button }</button>
    </div>
  </form>

    edit(e) {
      this.text = e.target.value
    }

    add(e) {
      var ma = null
      var matchAngle = this.text.match(/<<(\d+)/);
      if (matchAngle) ma = matchAngle[1]

      var replyto = opts.replyto || ma || null
      
      if (this.text) {
        reply(this.text, replyto)
        this.text = this.input.value = ''
      }
    }

</post-action>
