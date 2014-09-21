'use strict';

/* global require */

var endpoint = require('./endpoint');

var server = new endpoint.Endpoint();
server.start();
