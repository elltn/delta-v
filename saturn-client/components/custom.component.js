Vue.component('v-custom', {
  template: `
    <div><iframe v-show="loaded"></iframe></div>
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
      console.log(frame);

      // add root reference
      var v = document.createElement('script');
      v.setAttribute('type', 'text/javascript');
      v.innerHTML = 'const V = parent._VROOT;';
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
        console.log('frame loaded!');
      }
    },

    loadComponents: function() {

      var _this = this;

      _VDATABASE.runQuery('components', function(error, components) {
        if (error) return console.error(error);
        
        _this.$root.components = components;
        _this.setComponent(_this.component);

      })

    },

  },

  mounted: function() {
    
    // when a custom component is called make sure we have an 
    // uptodate list of 
    // components to use

    console.log('?', this.component);

    this.loadComponents();


  }
});