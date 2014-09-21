'use strict';

/* global exports:true */

exports.arrayContains = function (array, value) {
  var i;
  for (i = 0;i < array.length; i++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
};