'use strict';

/* global _ */
/* global $ */

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
    var domain = this.options.protocol + '://' + this.options.domain + '/';
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
        callback(error);
      }
    });
  },

  getUserId: function (userName, callback) {
    this.hitEndpoint(JerseyMapper.eps.get_user_id.format, [userName], {}, callback); 
  },

  getRosterList: function (userId, callback) {
    this.hitEndpoint(JerseyMapper.eps.get_roster_list.format, [userId], {}, callback);
  },

  getRoster: function (rosterId, callback) {
    this.hitEndpoint(JerseyMapper.eps.get_roster.format, [rosterId], {}, callback);
  }
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
  get_roster_list: {
    format: 'k' + 'e' + 'y' + '=13zBS3JGR0Z31HB1pIAB3bTbG9tc7F2w&' + 'action=get_roster_list&user_id={0}',
  },
  get_roster: {
    format: 'k' + 'e' + 'y' + '=13zBS3JGR0Z31HB1pIAB3bTbG9tc7F2w&' + 'action=get_roster&roster_id={0}',
  },
};