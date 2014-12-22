/*
 * grunt-migrate
 * https://github.com/ericsaboia/migrate-database
 *
 * Copyright (c) 2014 Eric Saboia
 * Licensed under the MIT license.
 */

 /**
 * Module dependencies.
 */

var pmongo = require('promised-mongo')
  , util = require('util')
  , _ = require('underscore')
;

/**
 * Expose `Mongodb`.
 */

module.exports = MongoDB;

/**
 * Initialize a new MongoDB Adapter with the given `config`
 *
 * @param {Object} config
 * @api private
 */

function MongoDB (config) {
  this.config = config;
  this.connect();
}

/**
 * Connect to the database.
 *
 * @api private
 */

MongoDB.prototype.connect = function () {
  var connectionStr = util.format('%s:%d/%s', this.config.host, this.config.port, this.config.database);
  this.db = pmongo(connectionStr, [this.config.collection]);
  this.collection = this.db.collection(this.config.collection);
};

/**
 * Insert a migration into the database
 * Called when a migration goes 'up'
 *
 * @api private
 */

MongoDB.prototype.insert = function (migration, callback) {
  this.collection.insert({name:migration}, callback);
};

/**
 * Remove a migration from the database
 * Called when a migration goes 'down'
 *
 * @api private
 */

MongoDB.prototype.remove = function (migration, callback) {
  this.collection.remove({name:migration}, callback);
};

/**
 * List all the migrations performed
 *
 * @api private
 */

MongoDB.prototype.list = function (sort, callback) {
  sort = (sort == 'up')? 1 : -1;

  this.collection.find().sort({name: sort}).toArray(function(err, results) {
    var migrations = _.pluck(results, 'name');
    callback(err, migrations);
  });
};