'use strict';

/* global utils:true */

var utils = {
  replaceNullOrUndefined: function (str, repValue) {
    if (repValue == null) { // jshint ignore:line
      repValue = '';
    }

    if (str == null) { // jshint ignore:line
      return repValue;
    }

    return str;
  }
};