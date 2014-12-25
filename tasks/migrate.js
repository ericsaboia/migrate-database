/*
 * migrate-database
 * https://github.com/ericsaboia/migrate-database
 *
 * Copyright (c) 2014 Eric Saboia
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var _ = require('lodash');
var Migrate = require('./lib/migrate');

var defaultConfig = {
  path: 'migrations/',
  adapter: 'MongoDB',
  db: {
    host: '127.0.0.1',
    port: 27017,
    database: 'migrate',
    collection: 'schema_migrations'
  }
};

module.exports = function(grunt) {
  var config = _.merge(defaultConfig, grunt.config.data.migrate);

  // Load initializer
  if (config.initializerPath)
    require( path.resolve(config.initializerPath) );

  // Create an Adapter instance
	var Adapter = require('./lib/adapters/' + config.adapter.toLowerCase());
	var adapter = new Adapter(config.db);

  // Create a Migrate instance
  var migrate = new Migrate(grunt, adapter, config, grunt.option('steps'));

  grunt.registerTask('migrate:create', 'creates a new migration', function(command) {
    if (!grunt.option('name'))
      throw new Error('--name required to create migration');

    migrate.create(grunt.option('name'), handlerErros(this.async()));
  });

  grunt.registerTask('migrate:up', 'executes all or limited new migrations\nUse --steps to control how many migrations would be executed', function(command) {
    migrate.up(handlerErros(this.async()));
  });

  grunt.registerTask('migrate:down', 'rollbacks one or more migrations\nUse --steps to control how many migrations would rollback', function(command) {  	
    migrate.down(handlerErros(this.async()));
  });

  /**
   * Only an Error instance or false are treated as failed task on Grunt
   * So we need to instance a Error for every non false error returned.
   */

  function handlerErros (done) {
    return function (err) {
      if (err) err = new Error(err);
      done(err);
    }
  }

};
