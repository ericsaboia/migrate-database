/*
 * grunt-migrate
 * https://github.com/ericsaboia/migrate-database
 *
 * Copyright (c) 2014 Eric Saboia
 * Licensed under the MIT license.
 */

'use strict';

var Migrate = require('./lib/migrate');

module.exports = function(grunt) {
  var config = grunt.config.data.migrate;

	var Adapter = require('./lib/adapters/' + config.adapter);
	var adapter = new Adapter(config.db);

  grunt.registerTask('migrate:create', 'creates a new migration', function(command) {
    if (!grunt.option('name'))
      throw new Error('--name required to create migration');

    var migrate = new Migrate(grunt, adapter, config.path, grunt.option('steps'));
    migrate.create(grunt.option('name'), this.async());
  });

  grunt.registerTask('migrate:up', 'executes all or limited new migrations\nUse --steps to control how many migrations would be executed', function(command) {
    var migrate = new Migrate(grunt, adapter, config.path, grunt.option('steps'));
    migrate.up(this.async());
  });

  grunt.registerTask('migrate:down', 'rollbacks one or more migrations\nUse --steps to control how many migrations would rollback', function(command) {  	
    var migrate = new Migrate(grunt, adapter, config.path, grunt.option('steps') || 1);
    migrate.down(this.async());
  });

};
