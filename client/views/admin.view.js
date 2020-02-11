// the admin view is the hub for an admin so they can access all the config 
// tools

_VGLOBALS.views.admin = Vue.component('v-admin', {
  template: /*html*/`
    <div name="admin-view">
    
      <nav class="v-menu">
        <div class="v-menu--header">
          <img src="img/v-logo.png"/>
        </div>
        <div class="v-menu--content">
          <div class="v-list">
            <h1>Admin</h1>
            <ul>
              <template v-for="item in menu">
                <router-link v-bind:to="item.path">
                  <li class="v-list--item">
                    <i v-bind:class="'fas fa-' + item.icon"></i>
                    <span>{{ item.name }}</span>
                  </li>
                </router-link>
              </template>
            </ul>
          </div>
          <div class="v-list">
            <h1>System</h1>
            <ul>
              <li class="v-list--item">
                <i class="fas fa-briefcase"></i><span>Account</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    
      <div class="v-app">
        <router-view></router-view>
      </div>
    </div>`,
  data: function() {
    return {
      menu: [
        { name: 'Database Manager', path: '/admin/database-manager', icon: 'database' },
        { name: 'Interface Designer', path: '/admin/interface-designer', icon: 'desktop' },
        { name: 'Automation Creator', path: '/admin/automation-creator', icon: 'cogs' },
        { name: 'Design Studio', path: '/admin/design-studio', icon: 'pencil-ruler' },
        { name: 'Developer Playground', path: '/admin/developer-playground', icon: 'wrench' }
      ],
    }
  },

  methods: {

    /*
      @method - loadPages()
      @desc - Loads all the current pages for the user from the database,
        then adds them to the root as well as the router

      @return {null}
    */
   loadPages: function() {
    var _this = this;
    _VDATABASE.runQuery('pages', function(error, pages) {
      if (error) return console.error(error);
      // add the interfaces to the root component so all components can access it
      _this.$root.pages = pages;
    });
  },

  },
  mounted: function() {

    // get the data we need to load the page initially
    this.loadPages();

  }
})