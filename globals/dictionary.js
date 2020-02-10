/*
  The dictionary takes a database row and turns it into a specific type of object.
  i.e. you want details for a specific table, we get that row from the 
  schema.BOX_table database, and create a new $Dictionary.Table() with the row.

  This ensures everything internally and externally works with row data in the 
  same way

  When the server gets data for API or UI it'll get the row and return it, and 
  then the rw will be put through the dictionary at the other side

  For internal server use we put it through the dictionary too
*/


var _VDICTIONARY = (function() {
  'use strict';

  // defines our properties and 'seals' the object from more items being added
  var _initialise = function(that, properties) {
    Object.defineProperties(that, properties);
    for (var prop in properties) {
      if (properties[prop].dirty = true) {
        Object.defineProperty(that, '_' + prop, properties[prop]);
      }
    }
    Object.seal(this);
  }

  return {

    /*
      When a customer adds a new table for their boxes we obvsiously can't just 
      update this dictionary each time. Instead using the table definition and 
      the row retrieved from the custom table we can return a custom object,

      i.e. someone has a 'customer' table and wants to retrieve a row, we return 
      them a new Customer() object with all the fields as vals
    */
    customDefinition: function(table, row) {
      var custom = {};
      var template = 'return function ' + table.name + `(table, row) { 
        var properties = {};
        table.columns.forEach(function(column) {
          properties[column.name] = {
            value: row[column.name],
            writable: column.system
          }
        })
        Object.defineProperties(this, properties);
        Object.seal(this);
      }`;
      custom[name] = new Function(template)(); // i just want it pretty ok
      return new custom[name](table, row);
    },

    /*
      A box stores all the information we need to pull the correct data out 
      for a virtual layer to send and render everything a user needs.
      A box is linked to a bunch of databases containing tables, permissions,
      ui, automation, designs, and code
    */
    Box: function(row) {
      _initialise(this, {
        id: { value: row.id },
        label: { value: row.label, writable: true, dirty: true },
        name: { value: row.label }, // once they make a name it's permanent
        schema: { value: row.schema }
      });
    },

    /*
      A user stores all the users for a given account, regardless of box.
      By default any user can log into any box. Users are used to set the 
      GRANT permissions on the partitioned schema tables
    */
    User: function(row) {
      _initialise(this, {
        id: { value: row.id },
        first_name: { value: row.first_name, writable: true, dirty: true },
        last_name: { value: row.last_name, writable: true, dirty: true },
        email: { value: row.email, writable: true, dirty: true }
      });
    },

    /*
      A permission defines what a given user or group of users can or can't see 
      or do within a box 
    */
    Permission: function(row) {
      _initialise(this, {
        id: { value: row.id },
        label: { value: row.label, writable: true, dirty: true },
        permissions: { value: row.permissions, writable: true, dirty: true }
      });
      /*
        the 'permissions' field is JSON that stores the CRUD for each type in 
        the dictionary at a base level. Do we also want to be able to say WHAT 
        items they can access, i.e. specific automation can't be triggered by X

        boxes: {c: 0, r: 0, u: 0, d: 0}
        users: {},
        permissions: {},
        interfaces: {},
        automation: {},
        file: {},
        component: {},
        customer: {} ... etc ...
      */
    },

    /*
      An page is a page as defined by the user to show in a tab of a box
      By default when a new table gets added to a box we create a 'home' and 
      a 'detail' interface for that table to get them started.

      'detail' interfaces always need a row id, but can be specified based on 
      row values, i.e. if this customer is only a potential you might have less 
      on the page that a full paying customer
    */
    Page: function(row) {  
      _initialise(this, {
        id: { value: row.id },
        label: { value: row.label, writable: true, dirty: true }, // i.e. 'My Homepage'
        name: { value: row.name, writable: true, dirty: true }, // i.e. 'custom'
        type: { value: row.type, writable: true, dirty: true }, // 'home', 'table', 'generic', or 'detail'
        path: { value: row.path, writable: true, dirty: true }, // relative path from /app/
        icon: { value: row.icon, writable: true, dirty: true }, // icon for tab
        default: { value: row.default, writable: true, dirty: true }, // whether this should be the default
        ui: { value: row.ui, writable: true, dirty: true } // TODO JSON structure
      });
    },

    /*
      An automation is a specific automatic action as defined by a user. This 
      could be an action triggered when a new record is created, updated, 
      called manually or called by another action
    */
    Automation: function(row) {
      _initialise(this, {
        id: { value: row.id },
        label: { value: row.label, writable: true, dirty: true },
        trigger: { value: row.trigger, writable: true, dirty: true }, // 'create', 'update', 'delete', 'manual', 'trigger'
        table: { value: row.table, writable: true, dirty: true }, // 'customer'
        process: { value: row.process, writable: true, dirty: true } // TODO JSON structure
      });
    },

    /*
      A file can be any document or email that has been designed in the 
      Design Studio
    */
    File: function(row) {
      _initialise(this, {
        id: { value: row.id },
        label: { value: row.label, writable: true, dirty: true },
        file_type: { value: row.file_type, writable: true, dirty: true }, // .pdf
        content_type: { value: row.content_type, writable: true, dirty: true }, // application/pdf
        contents: { value: row.contents, writable: true, dirty: true }, // TODO JSON structure
      });
    },


    Component: function(row) {},

    /*
      We store table definitions in one of the system tables (schema._tables)
      When we make a change to a table we make the row change then update the 
      definition row.

      Columns within a table are just stored in a JSON field
    */
    Table: function(row) {
      var columns = row.columns.map(function(column) {
        return new _VDICTIONARY.Column(column);
      });
      _initialise(this, {
        id: { value: row.id },
        label: { value: row.label, writable: true, dirty: true }, // 'Customer'
        plural: { value: row.plural, writable: true, dirty: true },  // 'Customers'
        icon: { value: row.icon, writable: true, dirty: true }, // FA icon name, i.e. 'walking'
        name: { value: row.name, writable: true, dirty: true },  // 'customer'
        schema: { value: row.schema, writable: true, dirty: true }, // '0a844D5hi1sD3e6r'
        columns: { value: columns } 
      });
    },

    Column: function(row) {
      _initialise(this, {
        label: { value: row.label, writable: true, dirty: true }, // 'First Name'
        name: { value: row.name, writable: true, dirty: true }, // 'first_name'
        datatype: { value: row.datatype, writable: true, dirty: true },
        required: { value: row.required, writable: true, dirty: true },// whether the column is required
        unique: { value: row.unique, writable: true, dirty: true }, // whether the column should be unique
        default: { value: row.default, writable: true, dirty: true },// the default value for a column
        system: { value: row.system }  // system fields like ID that can't be overwritten
      });
    }


  }


}());