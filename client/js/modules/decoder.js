var $Decoder = (function() {
  'use strict';
  return {

    encode: function(data) {
      return window.btoa(encodeURIComponent(data));
    },

    decode: function(data) {
      return decodeURIComponent(window.atob(data));
    }

  }
}());