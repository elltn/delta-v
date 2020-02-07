// this is the root vue for the whole client app
// every component will have this as the root so can have some useful
// functionality on it
const _VCORE = new Vue({
  router: _VROUTER,
  el: '#v',
  data: {

  },
  computed: {
    menu: function() { return _VGLOBALS.admin_menu; }
  },
  methods: {}
});
