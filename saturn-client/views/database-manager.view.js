// @TODO
// revisit how we structure admin pages, it would be nice to load them through 
// the default / page view system as if they were a page like anything else!

// need to wait until we've done more in the default.view + page.view rendering 
// before we can do that though


// database manage allows admins to create and manage their databases
// probably also want data quality rules in here somewhere

_VGLOBALS.views.databaseManager = Vue.component('v-database-manager-view', {
  template: `
  <div name="database-manager-view">
  
    <div v-show="loaded">
  
    <aside class="v-sidebar" key="a">
  
      <div class="v-sidebar--header">
        <div class="v-input">
          <input v-model="search" placeholder="Search tables.."/>
        </div>
      </div>
  
      <div class="v-sidebar--content">
        <div class="v-list">
          <h1>Setup</h1>
          <ul>
            <router-link to="/admin/database-manager">
              <li class="v-list--item">
                <i class="fas fa-home"></i><span>Home</span>
              </li>
            </router-link>
          </ul>
        </div>
        <div class="v-list">
          <h1>Custom</h1>
          <ul>
            <template v-for="c in filtered_custom">
              <router-link v-bind:to="'/admin/database-manager/' + c.name">
                <li class="v-list--item">
                  <i v-bind:class="'fas fa-' + c.icon"></i><span>{{ c.plural }}</span>
                </li>
              </router-link>
            </template>
          </ul>
        </div>
        <div class="v-list">
          <h1>System</h1>
          <ul>
            <template v-for="s in filtered_standard">
              <router-link v-bind:to="'/admin/database-manager/' + s.name">
                <li class="v-list--item">
                  <i v-bind:class="'fas fa-' + s.icon"></i><span>{{ s.plural }}</span>
                </li>
              </router-link>
            </template>
          </ul>
        </div>
  
      </div>
    </aside>
  
    <header class="v-header" key="b">
      <template v-if="selected == null">
        <div class="v-header--title">
          <div class="v-icon"><i class="fas fa-database"></i></div>
          <h1>Database Manager</h1>
        </div>
      </template>
      <template v-if="selected != null">
        <div class="v-header--title">
          <div class="v-icon">
            <i v-bind:class="'fas fa-' + selected.icon"></i>
          </div>
          <h1>{{ selected.plural }}</h1>
        </div>
        <div class="v-header--actions">
          <div class="v-button">
            <button>New Table</button>
          </div>
          <div class="v-button">
            <button>New Table</button>
          </div>
        </div>
      </template>
    </header>
  
    <main v-if="selected != null" class="v-content">
  
      <div class="v-subheader">
        <h2>Table Details</h2>
      </div>
      <div class="v-card">
        <div v-if="i % 2 == 0" v-for="(c, i) in columns" class="v-details--row">
          <v-detail v-bind:row="selected" v-bind:column="c"></v-detail>
          <v-detail v-bind:row="selected" v-bind:column="columns[i + 1]"></v-detail>
        </div>
      </div>
  
      <div class="v-break"></div>
      <div class="v-subheader">
        <h2>Table Columns</h2>
      </div>
      <div class="v-card">
        <div class="v-table">
          <table>
            <thead>
              <tr>
                <th>Column Label</th>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Required</th>
                <th>Unique</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in selected.columns">
                <td>
                  <div class="v-input">
                    <input placeholder="Label.." v-model="c._label"/>
                  </div>
                </td>
                <td>
                  <div class="v-input">
                    <input placeholder="Name.." v-model="c._name"/>
                  </div>
                </td>
                <td>
                  <div class="v-select">
                    <select v-model="c._datatype">
                      <option>Text</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div class="v-checkbox">
                    <input v-model="c._required" type="checkbox"/>
                  </div>
                </td>
                <td>
                  <div class="v-checkbox">
                    <input v-model="c._unique" type="checkbox"/>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  
    </div>
  
  </div>`,
  props: [],
  data: function() {
    return {
      custom: [],
      standard: [],
      loaded: false,
      search: ''
    }
  },
  computed: {

    filtered_custom: function() {
      return this.filterTables(this.custom);
    },

    filtered_standard: function() {
      return this.filterTables(this.standard);
    },

    selected: function() {
      var current = this.$route.params.table;
      var match = this.custom.concat(this.standard).filter(function(o) {
        return o.name == current;
      });
      return match.length == 0 ? null : match[0];
    },

    columns: function() {
      // same columns used for the database 'detail' section
      return [
        new _VDICTIONARY.Column({ id: 'v', label: 'Label', name: 'label', datatype: 'Text', required: true, unique: false, default: null, system: true }),
        new _VDICTIONARY.Column({ id: 'v', label: 'Plural Label', name: 'plural', datatype: 'Text', required: true, unique: false, default: null, system: true }),
        new _VDICTIONARY.Column({ id: 'v', label: 'API Name', name: 'name', datatype: 'Text', required: true, unique: false, default: null, system: true }),
        new _VDICTIONARY.Column({ id: 'v', label: 'Icon', name: 'icon', datatype: 'IconSelect', required: true, unique: false, default: null, system: true }),
      ]
    }

  },

  methods: {

    filterTables: function(tables) {
      var search = this.search.toLowerCase();
      return tables.filter(function(c) {
        var match = (c.plural + c.name).toLowerCase();
        return match.indexOf(search) != -1;
      });
    }

  },

  mounted: function() {
    // hardcoded for now, need to be retrieved from the database!
    this.custom = [
      new _VDICTIONARY.Table({ id: 'c', label: 'Customer', plural: 'Customers', name: 'customer', schema: 'v', icon: 'walking', columns: [
        { id: 'v', label: 'Id', name: 'id', datatype: 'Id', required: true, unique: false, default: null, system: true }
      ]})
    ];
    this.standard = [
      new _VDICTIONARY.Table({ id: '1', label: 'Box', plural: 'Boxes', name: 'box', schema: 'v', icon: 'boxes', columns: [
        { id: 'v', label: 'Id', name: 'id', datatype: 'Id', required: true, unique: false, default: null, system: true }
      ]})
    ];
    // boxes, users, permissions, interfaces, automation, designs, components
    var _this = this;
    setTimeout(function() {
      _this.loaded = true;
    }, 100);
  }
});