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
  template: `
    <div><iframe class="v-frame" v-show="loaded"></iframe></div>
  `,
  props: ['name'],

  data: function() {
    return {
      loaded: false,
    }
  },

  computed: {

    components: function() {
      return this.$root.components;
    },

    component: function() {
      var _this = this;
      return this.components.filter(function(component) {
        return component.name == _this.name;
      })[0];
    }

  },

  watch: {

    component: function(component) {
      this.setComponent(component);
    }

  },
  
  methods: {

    setComponent: function(component) {

      var _this = this;

      var iframe = this.$el.getElementsByTagName('iframe')[0];
      var frame = iframe.contentDocument || iframe.contentWindow.document;

      // add root reference
      var v = document.createElement('script');
      v.setAttribute('type', 'text/javascript');
      v.innerHTML = 'const V = parent._VROOT; var _VDICTIONARY = parent._VDICTIONARY;';
      v.setAttribute('id', 'v');

      // load vue by default
      var vu = document.createElement('script');
      vu.setAttribute('type', 'text/javascript');
      vu.setAttribute('src', '../globals/libs/vue.js');

      // load ui styles
      var style = document.createElement('link');
      style.setAttribute('href', './css/styles.css');
      style.setAttribute('type', 'text/css');
      style.setAttribute('rel', 'stylesheet');

      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.innerHTML = component.script;
      if (frame.getElementById('v') == null) {
        frame.head.appendChild(v);
        frame.head.appendChild(vu);
        frame.head.appendChild(style);
      }
      frame.body.className = 'v';
      frame.body.innerHTML = component.html;
      frame.body.onload = function() {
        frame.body.appendChild(script);
        _this.loaded = true;
      }
    },

    loadComponents: function() {

      var _this = this;

      _VDATABASE.runQuery('components', function(error, components) {
        if (error) return console.error(error);
        
        _this.$root.components = components.concat(_VGLOBALS.components);
        _this.setComponent(_this.component);

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