







/*
 *  @module - _VDATABASE
 *  @desc - Used to act as a fake database when we are developing offline
*/
var _VDATABASE = (function() {
  'use strict';

  return {

    updatePage: function(page, callback) {
      var query = "UPDATE dv_pages SET " + 
        "html = '" + $Decoder.encode(page.html) + "'" +
        "WHERE name = '" + page.name + "'";
      this.runQuery(query, callback);
    },

    getPages: function(callback) {
      this.runQuery('SELECT * FROM dv_pages', callback);
    },

    // @TODO all these functions need to be locked down, we don't want people 
    // injecting shit
    getComponent: function(name, callback) {
      this.runQuery("SELECT * FROM dv_components WHERE name = '" + name + "'", callback);
    },

    updateComponent: function(component, callback) {
      var query = "UPDATE dv_components SET " + 
        "html = '" + $Decoder.encode(component.html) + "', " +
        "controller = '" + $Decoder.encode(component.controller) + "', " +
        "style = '" + $Decoder.encode(component.style) + "', " +
        "properties = '" + $Decoder.encode(component.properties) + "' " +
        "WHERE name = '" + component.name + "'";
      console.log(query, component.html);
      this.runQuery(query, callback);
    },

    getComponents: function(callback) {
      this.runQuery('SELECT * FROM dv_components', callback);
    },

    runQuery: function(query, callback) {
      var url = 'https://deltav.herokuapp.com/api/database/query';
      var body = { query: query }
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          if (request.status == 200) {
            callback(null, JSON.parse(request.response).data);
          } else {
            callback(JSON.parse(request.response), null);
          }
        }
      }
      request.open('POST', url, true);
      request.send(JSON.stringify(body));
    }


  }

}());