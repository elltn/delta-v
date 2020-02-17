/*
  @component - Custom
  @desc - This component is used to render any component (meta!) that has been 
    created either by us internally (i.e. admin tools like the database 
    manager), or by a user for their own needs

    It ony needs to be passed a name, which is the unique api name for a 
    component (standard or custom), and it will render it as intended

    The component is iframed but we give it a reference to the root, vue, and 
    load in the v UI styles
*/

Vue.component('v-component', {
  template: /*html*/`
    <div name="v-component">
      <iframe v-bind:style="{'height': height}" class="v-frame"></iframe>
    </div>
  `,
  props: ['name', 'html', 'js', 'css', 'embed', 'log'],

  data: function() {
    return {
      loaded: true,
    }
  },

  computed: {

    height: function() {
      return this.component ? this.component.height : this.embed ? this.embed : 'auto';
    },

    components: function() {
      return this.$root.components;
    },

    component: function() {
      var _this = this;
      if (this.components == undefined) return null;
      var match = this.components.filter(function(component) {
        return component.name == _this.name;
      })[0];
      return match || null;
    }

  },

  watch: {

    component: function(component, old) {
      this.setComponent(component);
    },

    html: function() { this.setComponent(null); },
    js: function() { this.setComponent(null); },
    css: function() { this.setComponent(null); },

  },
  
  methods: {

    setComponent: function(component) {

      if (component == null) {
        if (this.html == null && this.js == null && this.css == null) return null;
      }

      var _this = this;
      this.loaded = false;

      var iframe = this.$el.getElementsByTagName('iframe')[0];
      var frame = iframe.contentDocument || iframe.contentWindow.document;

      var cscript = component ? component.controller : this.js;
      var chtml = component ? component.html : this.html;
      var cstyle = component ? component.style : this.css;

      var reference = /*javascript*/`
        var _top = window.top;
        var _VROOT = parent._VROOT;
        var _VDICTIONARY = parent._VDICTIONARY;
        var _VDATABASE = parent._VDATABASE;
        var _VGLOBALS = parent._VGLOBALS;
        var CodeMirror = parent.CodeMirror;
        var _VLOG = function() {
          var args = [].slice.call(arguments, 0);
          var ev = { 
            timestamp: new Date().toISOString(), 
            args: args
          };
          _top.dispatchEvent(new CustomEvent('vlog', { detail: ev }));
          console.log.call(arguments);
        }
      `;

      // load resources that won't change
      this.appendHeader(frame, null, 'script', null, reference);
      this.appendHeader(frame, null, 'script', '../globals/libs/vue.js');
      this.appendHeader(frame, null, 'script', './components/custom.component.js');
      this.appendHeader(frame, null, 'script', './js/modules/decoder.js');
      this.appendHeader(frame, null, 'style', './css/styles.css');
      this.appendHeader(frame, null, 'style', './css/fontawesome.min.css');
      this.appendHeader(frame, null, 'style', '../globals/libs/codemirror/codemirror.css');
      //this.appendHeader(frame, null, 'style', '../globals/libs/codemirror/addon/lint/lint.css');

      // load resource that will change
      this.appendHeader(frame, 'x-style', 'style', null, cstyle);

      var check = function() {
        if (iframe.contentWindow.Vue != undefined) {

            frame.body.className = 'v';
            frame.body.innerHTML = chtml;
          
              var cjs = frame.getElementById('cjs');
              if (cjs != null) frame.body.removeChild(cjs);
              var cj = document.createElement('script');
              cj.setAttribute('type', 'text/javascript');
              cj.setAttribute('id', 'cjs');
              cj.innerHTML = 'try { ' + cscript + '} catch(e) {}';

              frame.body.appendChild(cj);
              _this.loaded = true;

        } else {
          setTimeout(function() { check(); }, 100);
        }
      }
      check();

    },

    appendHeader: function(frame, id, type, src, raw) {
      var exist = frame.getElementById(id);
      if (exist == null || id != null) {
        if (exist != null) frame.head.removeChild(exist);
        var item = type == 'style' ? this.createStyle(id, src, raw) : this.createScript(id, src, raw);
        frame.head.appendChild(item);
      }
    },

    createStyle: function(id, src, raw) {
      var style = document.createElement(src ? 'link' : 'style');
      if (id != null) style.setAttribute('id', id);
      style.setAttribute('type', 'text/css');
      if (src) style.setAttribute('href', src);
      if (src) style.setAttribute('rel', 'stylesheet');
      if (raw) style.innerHTML = raw;
      return style;
    },

    createScript: function(id, src, raw) {
      var script = document.createElement('script');
      if (id != null) style.setAttribute('id', id);
      script.setAttribute('type', 'text/javascript');
      if (src) script.setAttribute('src', src);
      if (raw) script.innerHTML = raw;
      return script;
    },


    htmlDecode: function(html) {
      var el = document.createElement('textarea');
      el.innerHTML = html;
      return el.value;
    }, 

    loadComponents: function() {

      var _this = this;

      _VDATABASE.getComponent(this.name, function(error, components) {
        if (error) return console.error(error);

        console.log(components);
        
        components = components.map(function(c) {
          c.html = $Decoder.decode(c.html);
          c.style = $Decoder.decode(c.style);
          c.controller = $Decoder.decode(c.controller);
          c.properties = $Decoder.decode(c.properties);
          return c;
        });

        console.log(components);
        
        _this.$root.components = components;

      })

    },

  },

  mounted: function() {
    
    // when a custom component is called make sure we have an 
    // uptodate list of 
    // components to use
    

    this.loadComponents();


  }
});