'use strict';

/* global require */
/* global exports:true */

var fs = require('fs');
var utils = require('./utils');

var __keys = [
  '13zBS3JGR0Z31HB1pIAB3bTbG9tc7F2w',
];

exports.Connect = function (credentials, callback) { // jshint ignore:line
  if (!credentials.key) {
    callback('credentials.key is required');
    return;
  }
  if (!utils.arrayContains(__keys, credentials.key)) {
    callback('Invalid key');
    return;
  }

  fs.readFile('testData.json', 'utf8', function (err, data) {
    if (err) {
      callback('Unable to read data source.');
      return;
    }

    var jsonData = JSON.parse(data);
    if (typeof jsonData !== 'object') {
      callback('Invalid json test data file.');
    }

    var dataIface = new exports.DataInterface({data_obj: jsonData});
    callback(null, dataIface);
  });
};

exports.DataInterface = function (connection) {
  if (!connection.data_obj) {
    this.error = 'Missing data_obj';
  }
  this.connection = connection;
};

exports.DataInterface.prototype = {
  getUserId: function (userName, callback) {
    var users = this.connection.data_obj.users;
    var user;
    for (user in users) {
      if (users[user].user_name === userName) {
        callback(null, {'user_id': user});
        return;
      }
    }
    callback(null, {});
  },

  getRosterList: function (userId, callback) {
    if (typeof userId !== 'number') {
      userId = parseInt(userId);
    }
    if (isNaN(userId)) {
      callback('invalid user id');
      return;
    }

    var rosters = this.connection.data_obj.rosters;
    var userRosters = [];
    var roster, rosterObj, rosterInfo;
    for (roster in rosters) {
      rosterObj = rosters[roster];
      if (rosterObj.owner_id === userId) {
        rosterInfo = {
          owner_id: rosterObj.owner_id,
          name: rosterObj.name
        };
        rosterInfo.roster_id = parseInt(roster);
        userRosters.push(rosterInfo);
      }
    }
    callback(null, userRosters);
  },

  getRoster: function (rosterId, callback) {
    if (typeof rosterId === 'number') {
      rosterId = '' + rosterId;
    }

    var rosters = this.connection.data_obj.rosters;
    var roster;
    for (roster in rosters) {
      var rosterObj = rosters[roster];
      if (roster === rosterId) {
        rosterObj.roster_id = parseInt(roster);
        callback(null, rosterObj);
      }
    }
    callback(null, null);
  },
};
