/*
  @view - Default
  @desc - The default view is where we house all default '/app/' routes. These 
    routes are generated dynamically unlike the static '/admin/' routes, as 
    they are based off of the pages that a user has created.
    
    When this view loads for the first time it goes and gets all the pages 
    defined for this user and sets them to the root so we can access them from 
    any component.

    We then add router references for all these pages so they can be accessed
    properly from links
*/

_VGLOBALS.views.default = Vue.component('v-default', {

  template: `
  <div name="v-default">
  
    <nav class="v-menu">
      <div class="v-menu--header">
        <img src="img/v-logo.png"/>
      </div>
      <div class="v-menu--content">
        <div class="v-list">
          <h1>Pages</h1>
          <ul>
            <template v-for="page in pages">
              <router-link v-bind:to="'/app/' + page.path">
                <li class="v-list--item">
                  <i v-bind:class="'fas fa-' + page.icon"></i>
                  <span>{{ page.label }}</span>
                </li>
              </router-link>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <div class="v-app">
      <router-view></router-view>
    </div>
  
  </div>`,
  computed: {

    // we want to make sure we always have a direct copy of pages from the root
    pages: function() {
      return this.$root.pages
    }

  },
  methods: {

    /*
      @method - addRoutes()
      @desc - Takes a list of pages and adds them to the router under the '/app'
        path so they can be accessed properly.

        All paths just show the page view component but this handles the pages 
        itself.

      @param {List<Page>} pages - list of pages from the database

      @return {null}
    */
    addRoutes: function(pages) {
      var def = '/app/';
      _VROUTER.addRoutes([
        { 
          name: 'app', 
          path: '/app', 
          component: _VGLOBALS.views.default, 
          children: pages.map(function(page) {
            if (page.default == true) def += page.path;
            return {
              name: page.name,
              path: page.path,
              component: _VGLOBALS.views.page
            }
          })
        }
      ]);
      // if there's a default page and we're not on any page yet go 
      // to that default page
      if (['/', '/app', '/app/'].indexOf(this.$route.fullPath) != -1) {
        _VROUTER.push(def);
      }
    },


    htmlDecode: function(html) {
      var el = document.createElement('textarea');
      el.innerHTML = html;
      return el.value;
    },  


    /*
      @method - loadPages()
      @desc - Loads all the current pages for the user from the database,
        then adds them to the root as well as the router

      @return {null}
    */
    loadPages: function() {
      var _this = this;

      _VDATABASE.getPages(function(error, pages) {
        if (error) return console.error(error);
        // add the interfaces to the root component so all components can access it
        _this.$root.pages = pages.map(function(p) {
          console.log(p);
          p.html = $Decoder.decode(p.html);
          return p;
        });
        // add the new routes to the router
        _this.addRoutes(pages);
      });
    },


  },
  mounted: function() {

    // get the data we need to load the page initially
    this.loadPages();

  }
})