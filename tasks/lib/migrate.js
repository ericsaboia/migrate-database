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

var fs = require('fs')
  , async = require('async')
  , _ = require('lodash')
;

/**
 * Expose `Migrate`.
 */

module.exports = Migrate;

/**
 * Initialize a new migration `Migrate` with the given `grunt, adapter, path and steps`
 *
 * @param {Object} grunt
 * @param {Adapter} adapter
 * @param {String} path
 * @param {Number} steps
 * @api private
 */

function Migrate (grunt, adapter, path, steps) {
  this.grunt = grunt;
  this.adapter = adapter;
  this.path = path;
  this.steps = steps;
}

/**
 * creates a new migration with the given 'name' and call 'callback(err)'.
 *
 * @param {String} name
 * @param {Function} callback
 * @api public
 */

Migrate.prototype.create = function (name, callback) {
  if (!fs.existsSync(this.path))
    fs.mkdirSync(this.path);

  name = Date.now() + '_' + name + '.js';

  fs.createReadStream(__dirname + '/../../templates/migration.js')
      .pipe(fs.createWriteStream(this.path + '/' + name))
      .on('close', callback);

  this.grunt.log.writeln("Creating '%s'", name);
}

/**
 * Run down migrations and call `fn(err)`.
 *
 * @param {Function} fn
 * @api public
 */

Migrate.prototype.down = function(callback) {
  var that = this;
  that.adapter.list('down', function (err, migrated) {
    that.go('down', migrated, callback);
  });
};

/**
 * Run up migrations and call `fn(err)`.
 *
 * @param {Function} fn
 * @api public
 */

Migrate.prototype.up = function(callback) {
  var that = this;
  that.adapter.list('up', function (err, migrated) {
    var toMigrate = _.difference( migrationsAt(that.path), migrated ).sort();
    that.go('up', toMigrate, callback);
  });
};

/**
 * Walk through migrations in the given direction and call 'callback(err)'.
 *
 * @param {String} direction
 * @param {Array} toMigrate
 * @param {Function} callback
 * @api private
 */

Migrate.prototype.go = function (direction, toMigrate, callback) {
  if (this.steps) toMigrate = toMigrate.splice(0, this.steps);
  async.eachSeries(toMigrate, this.migrate(direction), callback);
};

/**
 * Run each migration in the given direction.
 *
 * @param {String} direction
 * @api private
 */

Migrate.prototype.migrate = function (direction) {
  var that = this;

  return function (migrationName, callback) {
    that.grunt.log.writeln("Runing %s '%s' migration", direction, migrationName);

    var migration = require(that.path + '/' + migrationName);
    migration[direction](function (err) {
      err? callback(err) : that.saveStateOf(migrationName, direction, callback);
    });
  }
};

/**
 * Insert or remove a migration from the database and call 'callback(err)'.
 *
 * @param {String} migration
 * @param {String} direction
 * @param {Function} callback
 * @api private
 */

Migrate.prototype.saveStateOf = function (migration, direction, callback) {
  var method = (direction == 'up') ? 'insert' : 'remove';
  this.adapter[method](migration, callback);
}


function migrationsAt (path) {
  return fs.readdirSync(path).filter(function(file){
    return file.match(/^\d+.*\.js$/);
  }).map(function (file) {
    return file.replace('.js', '');
  })
}