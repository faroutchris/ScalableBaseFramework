'use strict';

var express = require('express');

var appserver = express();

appserver.use(express.static('./public'));

appserver.listen(3000);