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


var $Dictionary = (function() {
  'use strict';

  var _initialise = function(that, properties) {
    Object.defineProperties(that, properties);
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
      _initialise({
        id: { value: row.id },
        label: { value: row.label, writable: true },
        schema: { value: row.schema }
      });
    },

    /*
      A user stores all the users for a given account, regardless of box.
      By default any user can log into any box. Users are used to set the 
      GRANT permissions on the partitioned schema tables
    */
    User: function(row) {
      _initialise({
        id: { value: row.id },
        first_name: { value: row.first_name, writable: true },
        last_name: { value: row.last_name, writable: true },
        email: { value: row.email, writable: true }
      });
    },

    /*
      A permission defines what a given user or group of users can or can't see 
      or do within a box 
    */
    Permission: function(row) {
      _initialise({
        id: { value: row.id },
        label: { value: row.label, writable: true },
        permissions: { value: row.permissions, writable: true }
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
      An interface is a page as defined by the user to show in a tab of a box
      By default when a new table gets added to a box we create a 'home' and 
      a 'detail' interface for that table to get them started.

      'detail' interfaces always need a row id, but can be specified based on 
      row values, i.e. if this customer is only a potential you might have less 
      on the page that a full paying customer
    */
    Interface: function(row) {  
      _initialise({
        id: { value: row.id },
        label: { value: row.label, writable: true },
        type: { value: row.type, writable: true }, // 'home', 'generic', or 'detail'
        ui: { value: row.ui, writable: true } // TODO JSON structure
      });
    },

    /*
      An automation is a specific automatic action as defined by a user. This 
      could be an action triggered when a new record is created, updated, 
      called manually or called by another action
    */
    Automation: function(row) {
      _initialise({
        id: { value: row.id },
        label: { value: row.label, writable: true },
        trigger: { value: row.trigger, writable: true }, // 'create', 'update', 'delete', 'manual', 'trigger'
        table: { value: row.table, writable: true }, // 'customer'
        process: { value: row.process, writable: true } // TODO JSON structure
      });
    },

    /*
      A file can be any document or email that has been designed in the 
      Design Studio
    */
    File: function(row) {
      this.id = row.id;
      this.label = row.label;
      this.file_type = row.file_type;
      this.content_type = row.content_type;
      this.contents = row.contents; // TODO JSON structure
    },


    Component: function(row) {},

    /*
      We store table definitions in one of the system tables (schema._tables)
      When we make a change to a table we make the row change then update the 
      definition row.

      Columns within a table are just stored in a JSON field
    */
    Table: function(row) {
      this.id = row.id;
      this.label = row.label; // 'Customer'
      this._label = row.label; // 'Customer'
      this.plural = row.plural; // 'Customers'
      this._plural = row.plural; // 'Customers'
      this.icon = row.icon;
      this._icon = row.icon;
      this.name = row.name; // 'customer'
      this._name = row.name; // 'customer'
      this.schema = row.schema; // '0a844D5hi1sD3e6r'
      this.columns = row.columns.map(function(column) {
        return new $Dictionary.Column(column);
      });
    },

    Column: function(row) {
      this.id = row.id;
      this.label = row.label; // 'First Name'
      this._label = row.label; // 'First Name'
      this.name = row.name; // 'first_name'
      this._name = row.name; // 'first_name'
      this.datatype = row.datatype; // 'Text'
      this._datatype = row.datatype; // 'Text'
      this.required = row.required; // whether the column is required
      this._required = row.required; // whether the column is required
      this.unique = row.unique; // whether the column should be unique
      this._unique = row.unique; // whether the column should be unique
      this.default = row.default; // the default value for a column
      this._default = row.default; // the default value for a column
      this.system = row.system; // system fields like ID that can't be overwritten
    }


  }


}());