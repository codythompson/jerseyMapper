'use strict';

/* global _ */

var JerseyMapper = function (options) {
  if (options == null) { // jshint ignore:line
    options = {};
  }
  _.defaults(options, this.options);
};
JerseyMapper.prototype = {
  options: {
    protocol: 'http',
    domain: 'localhost:3000'
  },

  hitEndpoint: function (format, values, headers, callback) {
    var domain = this.options.protocol + "://" + this.options.domain + "/";
    var qStr = '?' + JerseyMapper.format(format, values);
    var url = domain + qStr;

    $.ajax({
      dataType: 'json',
      url: url,
      headers: headers,
      success: function (data) {
        callback(null, data);
      },
      error: function (jqXHR, status, error) {
        callback(status);
      }
    });
  },
};

JerseyMapper.format = function (format, values) {
  var i;
  for (i = 0; i < values.length; i++) {
    format = format.replace('{' + i + '}', values[i]);
  }
  return format;
};

JerseyMapper.eps = {
  get_user_id: {
    format: 'k' + 'e' + 'y' + '=13zBS3JGR0Z31HB1pIAB3bTbG9tc7F2w&' + 'action=get_user_id&user_name={0}',
  },
};