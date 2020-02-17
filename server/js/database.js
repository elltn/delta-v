var $Database = (function() {
  'use strict';

  var _pool = require('pg').Pool;

  // connect to db as a pool
  var _db = new _pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  return {

    // runs a query on the database and returns a callback of (err, res)
    runQuery: function(query, callback) {
      _db.query(query, function(err, res) {
        console.log(err);
        return callback(err, res ? res.rows : null);
      });
    },

    /*
      When we create an account for the first time we need to create some 
      system tables, namely:

      _boxes - stores config info for a box
        a box is a specific instance of V. By default the first created is 
        the 'LIVE' box. Sandbox instances can then be created with seperate or 
        their own configuration
      _users - stores user info for that account, across all boxes

      When we create a box, each box then has it's own objects defined:
      schema.BOXNAME_tables - stores custom table definitions
      schema.BOXNAME_permissions - stores permissions for the account
      schema.BOXNAME_ui  - stores UI config for a box
      schema.BOXNAME_automation - stores automation for a box
      schema.BOXNAME_design - stores document / email design info for a box
      schema.BOXNAME_components - stores standard + custom components

      A setup account's databases, (schema name SATURN) might look like:

      // standard tables, with a LIVE box
      SATURN._boxes
      SATURN._users
      SATURN.LIVE_tables
      SATURN.LIVE_permissions
      SATURN.LIVE_interfaces
      SATURN.LIVE_automation
      SATURN.LIVE_files
      SATURN.LIVE_components

      // custom tables
      SATURN.LIVE__customers
      SATURN.LIVE__orders
      SATURN.LIVE__products

    */
    setupDefaults: function() {

    }


  }

}());

module.exports = $Database;