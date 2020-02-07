
// store anything we need on any module / page / component
var _VGLOBALS = {

  admin_menu: [
    { name: 'Database Manager', path: '/admin/database-manager', icon: 'database' },
    { name: 'Interface Designer', path: '/admin/interface-designer', icon: 'desktop' },
    { name: 'Automation Creator', path: '/admin/automation-creator', icon: 'cogs' },
    { name: 'Design Studio', path: '/admin/design-studio', icon: 'pencil-ruler' },
    { name: 'Developer Playground', path: '/admin/developer-playground', icon: 'wrench' }
  ],

  views: {
    blank: { template: '<div>TODO</div>' },
    error: { template: '<div>404</div>' }
  }

}


// make sure vue uses the router!
Vue.use(VueRouter);