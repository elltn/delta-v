// this stores all the 'routes' that the SPA will have
// all 'views' we add should be added to the _VGLOBALS
const _VROUTER = new VueRouter({
  routes: [
    { path: '/', component: _VGLOBALS.views.blank },
    { path: '/admin/database-manager', component: _VGLOBALS.views.databaseManager },
    { path: '/admin/database-manager/:table', component: _VGLOBALS.views.databaseManager },
    { path: '/admin/interface-designer', component: _VGLOBALS.views.blank },
    { path: '/admin/automation-creator', component: _VGLOBALS.views.blank },
    { path: '/admin/design-studio', component: _VGLOBALS.views.blank },
    { path: '/admin/developer-playground', component: _VGLOBALS.views.blank },
    { path: '*', component: _VGLOBALS.views.error },
  ]
});