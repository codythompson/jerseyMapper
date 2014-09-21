'use strict';

/* global exports:true */
/* global require */

var http = require('http');
var url = require('url');
var data = require('./testDataInterface');

var actionMap = {
  get_user_id: {
    func_name: 'getUserId',
    query_arg_names: ['user_name'],
  },
  get_roster_list: {
    func_name: 'getRosterList',
    query_arg_names: ['user_id'],
  },
  get_roster: {
    func_name: 'getRoster',
    query_arg_names: ['roster_id'],
  }
};

exports.Endpoint = function (options) {
  if (options == null) { // jshint ignore:line
    options = {};
  }

  if (!options.port) {
    options.port = 3000;
  }

  this.handleRequest = this.handleRequest.bind(this);

  this.server = http.createServer(this.handleRequest);

  this.options = options;
};

exports.Endpoint.prototype = {
  writeResponse: function (res, code, content, headers) {
    headers['Access-Control-Allow-Origin'] = '*';
    res.writeHead(code, headers);
    res.end(content);
  },
  writeSuccess: function (res, jsonObj) {
    var content = JSON.stringify(jsonObj);
    this.writeResponse(res, 200, content, {'Content-Type': 'application/json'});
  },

  connectToDb: function (queryObj, callback) {
    if (!queryObj.key) {
      callback([400, 'Missing key arg']);
      return;
    }

    data.Connect({key: queryObj.key}, function (err, data) {
      if (err) {
        callback([401, err]);
        return;
      }

      callback(null, data);
    });
  },

  validateActionArgs: function (queryObj) {
    if (!queryObj.action) {
      return 'Missing action arg';
    }

    var actionInfo = actionMap[queryObj.action];
    if (actionInfo === undefined) {
      return 'Unknown action';
    }

    var i = 0;
    for (i; i < actionInfo.query_arg_names.length; i++) {
      var argName = actionInfo.query_arg_names[i];
      if (!queryObj[argName]) {
        return 'Missing ' + argName + ' arg';
      }
    }
  },

  buildAction: function (queryObj) {
    var action = {
      func_name: actionMap[queryObj.action].func_name,
      args: []
    };

    var queryParams = actionMap[queryObj.action].query_arg_names;
    var i = 0;
    for (i; i < queryParams.length; i++) {
      action.args.push(queryObj[queryParams[i]]);
    }

    return action;
  },

  performAction: function (queryObj, dbConn, callback) {
    var queryArgError = this.validateActionArgs(queryObj);
    if (queryArgError !== undefined) {
      callback([400, queryArgError]);
      return;
    }

    var action = this.buildAction(queryObj);
    action.args.push(function (err, data) {
      if (err) {
        callback([400, err]);
        return;
      }

      callback(null, data);
    });
    var func = dbConn[action.func_name];
    func.apply(dbConn, action.args);
  },

  handleError: function (res, err) {
    this.writeResponse(res, err[0], err[1], {'Content-Type': 'text/html'});
  },

  handleRequest: function (req, res) {
    try {
      var urlObj = url.parse(req.url, true);
      var queryObj = urlObj.query;
      var self = this;
      this.connectToDb(queryObj, function (err, dbConn) {
        if (err) {
          self.handleError(res, err);
          return;
        }

        self.performAction(queryObj, dbConn, function (err, jsonObj) {
          if (err) {
            self.handleError(res, err);
            return;
          }

          self.writeSuccess(res, jsonObj);
        });
      });
    } catch (e) {
      this.handleError(res, [500, 'Server Error']);
    }
  },

  start: function () {
    this.server.listen(this.options.port);
  }
};