/*
 *  @module - _VDATABASE
 *  @desc - Used to act as a fake database when we are developing offline
*/
const _VDATABASE = (function() {
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
        ui: `
          <div name="Page">
            <main class="v-content">
              This is a standard table page for customers
              <br/>
              This is a custom component being loaded in a frame.
              The frame has access to the root _VROOT variable, plus Vue and 
              the main stylesheet<br/><br/>
              <v-custom name="my_custom_component"></v-custom>
            </main>
          </div>
        `, 
        path: 's/customers', icon: 'walking', default: true },
      { id: '2', label: 'Custom Page', name: 'other', type: 'generic', 
        ui: `
          <div name="page">
            <header class="v-header">Hi</header>
            <main class="v-content">
              This is my first page <br/>
              <v-test></v-test>
            </main>
          </div>
        `, 
        path: 'other', icon: 'cogs', default: false },
    ],
    'components': [
      { 
        id: '1', label: 'My Custom Component', name: 'my_custom_component',
        html: `
          <div id="myApp">
            Hello {{ name }}!
          </di>
        `,
        script: `
          var x = new Vue({
            el: '#myApp',
            data: {
              name: 'Elliott'
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