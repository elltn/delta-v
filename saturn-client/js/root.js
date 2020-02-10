// this is the root vue for the whole client app
// every component will have this as the root so can have some useful
// functionality on it

// can't be const because then custom.component.js iframes wouldn't be 
// able to access it!
var _VROOT = new Vue({
  router: _VROUTER,
  el: '#v',
  data: {
    pages: [],
    components: []
  },

  methods: {}
});
