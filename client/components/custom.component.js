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

    html: function(change) {
      this.setComponent(null);
    },

    js: function() {
      this.setComponent(null);
    },

    css: function() {
      this.setComponent(null);
    },

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

      var cscript = component ? component.js : this.js;
      var chtml = component ? component.html : this.html;
      var cstyle = component ? component.css : this.css;

      // add root reference
      var v = document.createElement('script');
      v.setAttribute('type', 'text/javascript');
      v.innerHTML = `
        var _top = window.top;
        var _VROOT = parent._VROOT;
        var _VDICTIONARY = parent._VDICTIONARY;
        var _VDATABASE = parent._VDATABASE;
        var _VGLOBALS = parent._VGLOBALS;
        var CodeMirror = parent.CodeMirror;
      `;
      if (this.log == true) {
        // add log hook for this component
        // @TODO add alternate for console.trace() for the stack
        v.innerHTML += `
          // forgive me browsers for I have sinned
          var _original = console.log;
          console.log = function(trace) {
            var stack = new Error().stack;
            stack = stack.indexOf('Error') == 0 ? 
              'Stacktrace: ' + stack.substr(6, stack.length) : stack;
            var args = [].slice.call(arguments, 0);
            if (trace == '_VSTACKTRACE') args.push(stack);
            _top.dispatchEvent(new CustomEvent('vlog', { detail: { timestamp: new Date().toISOString(), args: args}}));
            _original.apply(console, args); 
          }
        `
      }
      v.setAttribute('id', 'v');

      // load vue by default
      var vu = document.createElement('script');
      vu.setAttribute('type', 'text/javascript');
      vu.setAttribute('src', '../globals/libs/vue.js');

      // load components
      var c1 = document.createElement('script');
      c1.setAttribute('type', 'text/javascript');
      c1.setAttribute('src', './components/custom.component.js');

      // load ui styles
      var style = document.createElement('link');
      style.setAttribute('href', './css/styles.css');
      style.setAttribute('type', 'text/css');
      style.setAttribute('rel', 'stylesheet');
      
      // load css mirror styles
      var cmstyle = document.createElement('link');
      cmstyle.setAttribute('href', '../globals/libs/codemirror/codemirror.css');
      cmstyle.setAttribute('type', 'text/css');
      cmstyle.setAttribute('rel', 'stylesheet');

      // load component style
      var ccc = document.createElement('style');
      ccc.innerHTML = cstyle;
      ccc.setAttribute('type', 'text/css');
      ccc.setAttribute('rel', 'stylesheet');

      if (frame.getElementById('v') == null) {
        frame.head.appendChild(v);
        frame.head.appendChild(vu);
        frame.head.appendChild(style);
        frame.head.appendChild(cmstyle);
        frame.head.appendChild(c1);
      }

      var check = function() {
        if (iframe.contentWindow.Vue != undefined) {

            frame.body.className = 'v';
            frame.body.innerHTML = '<style>' + cstyle + '</style>' + chtml;
          
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

    loadComponents: function() {

      var _this = this;

      _VDATABASE.runQuery('components', function(error, components) {
        if (error) return console.error(error);
        
        _this.$root.components = components.concat(_VGLOBALS.components);

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