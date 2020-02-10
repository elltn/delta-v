/*
  @view - Page
  @desc - The page view is used to contain any page, standard or 
    custom, and render the contents. 

    The page rendered is based on the current path given and only if 
    there is an page row in the database with that matching path.

    The content itself is rendered through the proxy component (defined at the 
    bottom of this file), which allows us to turn a static string into 
    dynamic vue.
*/

_VGLOBALS.views.page = Vue.component('v-page-view', {
  template: `
  <div name="page-view">
    <v-proxy :content="content"></v-proxy>
  </div>`,
  data: function() {
    return {
      content: {}
    }
  },
  computed: {
    
    // always returns the current full URL path from the router
    selected: function() {
      return this.$route.fullPath;
    },

    // finds a matching page from the root to match our current URL path
    page: function() {
      var _this = this;
      return _this.$root.pages.filter(function(i) {
        var path = '/app/' + i.path;
        return path == _this.selected;
      })[0];
    }

  },
  watch: {

    // when the current page changes (i.e. changing tabs)
    // we need to re-render the proxy component
    page: function(page) {
      this.setContent(page);
    } 

  },
  methods: {

    // to render the proxy contents we compile the raw ui string
    // then set the rendered return as the content for the proxy
    setContent: function(page) {
      var proxy = Vue.compile(page.ui);
      this.content = proxy.render.call(this, this.$createElement);
    }

  },
  mounted: function() {

    // we need to trigger the first proxy render manually when mounted
    this.setContent(this.page);
    
  }
});

// the ditto is used by the interface to dynamically generate UI's based on 
// a given interfaces UI data
// this means any dynamic stuff gets compiled properly by vue
Vue.component('v-proxy', {
	functional: true,
  props: ['content'],
  render: function(createElement, context) {
  	return context.props.content;
  }
})