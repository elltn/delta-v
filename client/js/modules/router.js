// this stores all the 'routes' that the SPA will have
// all 'views' we add should be added to the _VGLOBALS
const _VROUTER = new VueRouter({
  routes: [
    { name: 'admin', path: '/admin', component: _VGLOBALS.views.admin, 
      children: [
        { path: 'database-manager', component: _VGLOBALS.views.page },
        { path: 'database-manager/:table', component: _VGLOBALS.views.page },
        { path: '*', component: _VGLOBALS.views.error },
      ]
    },
    { path: '*', component: _VGLOBALS.views.default },
  ]
});