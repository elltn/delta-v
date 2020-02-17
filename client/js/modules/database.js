







/*
 *  @module - _VDATABASE
 *  @desc - Used to act as a fake database when we are developing offline
*/
var _VDATABASE = (function() {
  'use strict';

  var _data = {
    'tables': [
      {
        id: '1',
        label: 'Customer',
        plural: 'Customers',
        icon: 'walking',
        name: 'customer',
        schema: 'deltav',
        columns: [
          { label: 'Id', name: 'id', datatype: 'Id', required: true, unique: true, default: null, system: true },
          { label: 'Name', name: 'name', datatype: 'Text', required: true, unique: false, default: null, system: false },
          { label: 'Email', name: 'email', datatype: 'Email', required: false, unique: false, default: null, system: false }
        ]
      }
    ],
    'customers': [
      { id: '1', name: 'Elliott Thurman-Newell', email: 'elliott@appitek.com' },
      { id: '2', name: 'Ronan Williams', email: 'rjwilliams@gmail.com' },
      { id: '3', name: 'Sherelle Kelleher', email: 'sherellekelleher@gmail.com' },
      { id: '4', name: 'Angus Kerr', email: 'angus@konsul.co.uk' },
      { id: '5', name: 'Richard O\'Gormon', email: 'tootawlmusic@hotmail.co.uk' },
      { id: '6', name: 'Billee Smith', email: 'billiejsmith@google.com' }
    ],
    'pages': [
      { id: '1', label: 'Customers', name: '_customers', type: 'table', 
        ui: /*html*/`
          <main class="v-content">
            This is a standard table page for customers
            <br/>
            This is a custom component being loaded in a frame.
            <v-component embed="100px" name="my_custom_component"></v-component>
            <v-component embed="100px" name="my_custom_component"></v-component>
            <v-component embed="100px" name="my_custom_component"></v-component>
            The frame has access to the root _VROOT variable, plus Vue and 
            the main stylesheet<br/>
            We can also load in standard components predefined, like an input
            <v-input placeholder="Edit me!"></v-input>
          </main>
        `, 
        path: 's/customers', icon: 'walking', default: true },
      { 
        id: '2', 
        label: 'Custom Page', 
        name: 'other', 
        type: 'generic', 
        path: 'other', 
        icon: 'cogs', 
        default: false,
        ui: /*html*/`
          <header class="v-header">
            <div class="v-header--title">
              <div class="v-icon"><i class="fas fa-cogs"></i></div>
              <h1>Custom Page</h1>
            </div>
          </header>
          <main class="v-content">
            This is my first page <br/>
          </main>
        `  
      },
      { 
        id: '3', 
        label: 'Developer Console', 
        name: '_developer_console', 
        type: 'system', 
        path: 'developer-console', 
        icon: 'wrench', 
        default: false,
        ui: /*html*/`
            <v-component name="_developer_console"></v-component>
          ` },
    ],
    'components': [
      { 
        id: '1', label: 'My Custom Component', name: 'my_custom_component',
        height: '100px',
        html: /*html*/`
          <div id="myApp">
            Hello {{ name }}!<br/>
            I'm a mini Vue app! I've clicked {{ count }} times
            <button v-on:click="addCount()">Add</button>
          </div>
        `,
        css: /*css*/`
         body.v { background: pink; }
        `,
        js: /*javascript*/`
          var x = new Vue({
            el: '#myApp',
            data: {
              name: 'Elliott',
              count: 0
            },
            methods: {
              addCount: function() { this.count += 1; }
            }
          });
        `
      }
    ]
  }

  return {


    runQuery: function(query, callback) {
      callback(null, _data[query]);
    }


  }

}());