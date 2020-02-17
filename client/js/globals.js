
// store anything we need on any module / page / component
var _VGLOBALS = {

  views: {
    blank: { template: '<div>TODO</div>' },
    error: { template: '<div>404</div>' }
  },

  components: [

    { 
      id: 'x', 
      label: 'Developer Console', 
      name: '_developer_console',
      height: '100%',
      html: btoa(/*html*/`
        <div name="developer-console">

          <div id="vdc">

          <div class="v-button save">
            <button v-on:click="updateFile()">Save</button>
          </div>

          <aside class="v-sidebar" key="a">

          <div class="v-sidebar--header">
            <div class="v-input">
              <input v-model="search" placeholder="Search tables.."/>
            </div>
          </div>

          <div class="v-sidebar--content">
            <div class="v-list">
              <h1>Pages</h1>
              <ul>
                <template v-for="p in pages">
                  <li v-bind:class="{'v-selected': file && file.name == p.name}" v-on:click="loadFile(p, 'page')" class="v-list--item">
                    <i class="fas" v-bind:class="'fa-' + p.icon"></i><span>{{ p.label }}</span>
                  </li>
                </template>
              </ul>
            </div>
            <div class="v-list">
              <h1>Components</h1>
              <ul>
                <template v-for="c in components">
                  <li v-bind:class="{'v-selected': file && file.name == c.name}" v-on:click="loadFile(c, 'component')" class="v-list--item">
                    <i class="fas" v-bind:class="'fa-' + c.icon"></i><span>{{ c.label }}</span>
                  </li>
                </template>
              </ul>
            </div>

          </div>
        </aside>

            <main v-show="file" class="v-content v-pad--none">

              <div class="v-grid v-grid--columns">
                <div class="v-grid v-grid--rows">
                  <div class="full" style="background: #192746;">
                    <ul class="tabs">
                      <li v-on:click="tab = 'html'" v-bind:class="{'selected': tab == 'html'}">HMTL</li>
                      <li v-show="type == 'component'" v-on:click="tab = 'js'" v-bind:class="{'selected': tab == 'js'}">JAVASCRIPT</li>
                      <li v-show="type == 'component'" v-on:click="tab = 'css'" v-bind:class="{'selected': tab == 'css'}">CSS</li>
                    </ul>
                    <div class="tab" v-bind:class="{'show': tab == 'html'}">
                      <textarea id="html"></textarea>
                    </div>
                    <div class="tab" v-bind:class="{'show': tab == 'css'}">
                      <textarea id="css"></textarea>
                    </div>
                    <div class="tab" v-bind:class="{'show': tab == 'js'}">
                      <textarea id="js"></textarea>
                    </div>
                  </div>
                </div>
                <div class="v-grid v-grid--rows">
                  <div class="full">
                    <v-component v-bind:log="true" embed="50vh" :html="xhtml" :js="xjs" :css="xcss"></v-component>
                  </div>
                  <div class="full console">
                    <div v-for="l in logs">
                      <pre style="margin: 0px"><span>{{ l.timestamp }}</span> {{ l.args.join(',') }}</pre>
                    </div>
                  </div>
                </div>
              </div>

            </main>
          </div>

        </div>
      `),
      style: btoa(/*css*/`
        .save { position: fixed; z-index: 1000; bottom: 20px; left: 20px; width: 180px }
        .full { height: 100vh; position: relative; } 
        .tab { position: absolute; top: 70px; bottom: 0; left: 0; right: 0; background: #192746; z-index: 1; }
        .tab.show { z-index: 10; }
        .tabs { height: 50px; position: absolute; top: 0; left: 0; right: 0; background: #13203A; }
        .tabs li { float: left; list-style: none; padding: 0 20px; color: #6D7C9D; font-weight: 600; line-height: 50px; text-align: center; cursor: pointer }
        .tabs li.selected { background: #192746}
        .full textarea { height: 100%; width: 100% }
        .CodeMirror { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
      `),
      controller: btoa(/*javascript*/`
        _top._DeveloperConsole = new Vue({
          el: '#vdc',
          data: {
            xhtml: '',
            xjs: '',
            xcss: '',
            html: {},
            js: {},
            css: {},
            loaded: false,
            logs: [],
            tab: 'html',
            search: '',
            pages: [],
            components: [],
            file: null,
            type: ''
          },

          computed: {

            jserrors: function() {
              if (this.js && this.js.state) {
                return this.js.state.lint.marked.map(function(x) {
                  var annotation = x.__annotation;
                  return {
                    message: annotation.message,
                    from: annotation.from.line + ':' + annotation.from.ch,
                    to: annotation.to.line + ':' + annotation.to.line
                  }
                })
              }
              return [];
            }

          },

          methods: {

            startMirror: function(id, mode) {
              var _this = this;
              this[id] = CodeMirror.fromTextArea(document.getElementById(id), {
                lineNumbers: true, 
                tabSize: 2,
                mode: mode,
                gutters: ["CodeMirror-lint-markers"],
                lint: true
              });
              this[id].on('change', function(cm) { _this['x' + id] = cm.getValue(); });
            },

            setMirror: function(id, def) {
              this[id].setValue(def);
              this[id].refresh();
            },

            loadFile: function(file, type) {
              var _this = this;
              this.file = file;
              this.type = type;
              this.tab = 'html';
              console.log(file.html);
              Vue.nextTick(function() {
                _this.setMirror('html', file.html);
                _this.setMirror('js', file.controller || '');
                _this.setMirror('css', file.style || '');
              })
            },

            updateFile: function() {
              if (this.type == 'component') {
                _VDATABASE.updateComponent({
                  html: this.xhtml,
                  style: this.xcss,
                  controller: this.xjs,
                  properties: '{}',
                  name: this.file.name
                }, function(error, data) {
                  console.log(error, data);
                });
              } 
              if (this.type == 'page') {
                _VDATABASE.updatePage({
                  html: this.xhtml,
                  name: this.file.name
                }, function(error, data) {
                  console.log(error, data);
                });
              }
            },

          },

          mounted: function() {


            var _this = this;

            _VDATABASE.getPages(function(error, data) {
              _this.pages = data.map(function(p) {
                p.html = $Decoder.decode(p.html);
                return p;
              });
            })

            _VDATABASE.getComponents(function(error, data) {

              _this.components = data.map(function(c) {
                c.html = $Decoder.decode(c.html);
                c.style = $Decoder.decode(c.style);
                c.controller = $Decoder.decode(c.controller);
                return c;
              });
            })

            this.startMirror('html', 'htmlmixed');
            this.startMirror('js', 'javascript');
            this.startMirror('css', 'css');

            _top.addEventListener('vlog', function(log, data) {
              console.log(log.detail);
              _this.logs.push(log.detail);
            })

            Vue.nextTick(function() {
              _this.loaded = true;
            });

            

          }
        });
      `)
    },


    { id: 'x', label: 'Database Manager', name: '_database_manager', 
      html: /*html*/`
      <div name="database-manager-view">

        <div id="vdm" v-show="loaded">

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
                <li v-on:click="goTo('/admin/database-manager')" class="v-list--item">
                  <i class="fas fa-home"></i><span>Home</span>
                </li>
              </ul>
            </div>
            <div class="v-list">
              <h1>Custom</h1>
              <ul>
                <template v-for="c in filtered_custom">
                  <li v-on:click="goTo('/admin/database-manager/' + c.name)" class="v-list--item">
                    <i v-bind:class="'fas fa-' + c.icon"></i><span>{{ c.plural }}</span>
                  </li>
                </template>
              </ul>
            </div>
            <div class="v-list">
              <h1>System</h1>
              <ul>
                <template v-for="s in filtered_standard">
                  <li v-on:click="goTo('/admin/database-manager/' + s.name)" class="v-list--item">
                    <i v-bind:class="'fas fa-' + s.icon"></i><span>{{ s.plural }}</span>
                  </li>
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

      </div>
      `, 
      controller: /*javascript*/`
      new Vue({
        el: '#vdm',
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
      var current = V.$route.params.table;
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

    goTo: function(path) {
      console.log(path);
      V.goTo(path);
    },

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
      `
    }
  ]

}


// make sure vue uses the router!
Vue.use(VueRouter);