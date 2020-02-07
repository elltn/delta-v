Vue.use(VueRouter);

const _DEFAULT = { template: '<div>TODO</div>' }
const _ERROR = { template: '<div>404</div>' }
const _MENU = [
  { name: 'Database Manager', path: '/admin/database-manager', icon: 'database' },
  { name: 'Interface Designer', path: '/admin/interface-designer', icon: 'desktop' },
  { name: 'Automation Creator', path: '/admin/automation-creator', icon: 'cogs' },
  { name: 'Design Studio', path: '/admin/design-studio', icon: 'pencil-ruler' },
  { name: 'Developer Playground', path: '/admin/developer-playground', icon: 'wrench' }
];

const _ROUTER = new VueRouter({
  routes: [
    { path: '/', component: _DEFAULT },
    { path: '/admin/database-manager', component: _DATABASE_MANAGER },
    { path: '/admin/database-manager/:table', component: _DATABASE_MANAGER },
    { path: '/admin/interface-designer', component: _DEFAULT },
    { path: '/admin/automation-creator', component: _DEFAULT },
    { path: '/admin/design-studio', component: _DEFAULT },
    { path: '/admin/developer-playground', component: _DEFAULT },
    { path: '*', component: _ERROR },
  ]
});

const V = new Vue({
  router: _ROUTER,
  el: '#v',
  data: {

  },
  computed: {
    menu: function() { return _MENU; }
  },
  methods: {}
});
