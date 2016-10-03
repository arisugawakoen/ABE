<post-action>
  <form onsubmit={ add } class="ui form">
    <div class="field">
      <textarea name="input" onkeyup={ edit } rows="4" style="border:none; 
        box-shadow: 0 0 2px { backgroundColor } inset;"></textarea>
      <a class="fluid ui button" if={ !toggle }
       onclick={ accordion }>背景色選択</a>
      <div class="ui attached bottom center aligned segment"
       style="border-radius: .4rem;" if={ toggle } onclick={ color }>
        <a class="ui red circular label" title="red"></a>
        <a class="ui orange circular label" title="orange"></a>
        <a class="ui yellow circular label" title="yellow"></a>
        <a class="ui olive circular label" title="olive"></a>
        <a class="ui green circular label" title="green"></a>
        <a class="ui teal circular label" title="teal"></a>
        <a class="ui blue circular label" title="blue"></a>
        <a class="ui violet circular label" title="violet"></a>
        <a class="ui purple circular label" title="purple"></a>
        <a class="ui pink circular label" title="pink"></a>
        <a class="ui brown circular label" title="brown"></a>
        <a class="ui grey circular label" title="grey"></a>
        <a class="ui black circular label" title="black"></a>
      </div>
      <button disabled={ !text }
        class="fluid ui button">{ opts.button }</button>
    </div>
  </form>

    var toggle = false
    var backgroundColor = ''
    

    accordion() {
      this.toggle = !this.toggle
    }

    color(e) {
      this.backgroundColor = e.target.title
    }    

    edit(e) {
      this.text = e.target.value
    }

    add(e) {
      var ma = null
      var matchAngle = this.text.match(/<<(\d+)/);
      if (matchAngle && matchAngle[1] < 100000000) ma = matchAngle[1]

      var replyto = opts.replyto || ma || null
      var bgColor = this.backgroundColor || null     
 
      if (this.text) {
        reply(this.text, replyto, bgColor)
        this.text = this.input.value = this.backgroundColor = ''
      }
    }

</post-action>
