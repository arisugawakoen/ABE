<search-action>
  <form onsubmit={ ask } class="ui fluid icon input">
    <input type="text" placeholder="Search..." name="input" onkeyup={ edit }>
    <button disabled={ !text } class="ui button">検索</button>
  </form>

    if (opts.query) this.input.value = opts.query

    edit(e) {
      this.text = e.target.value
    }

    ask(e) {
      if (this.text) {
        search(this.text)
      }
    }

</search-action>
