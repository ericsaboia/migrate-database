/*
 * migrate-database
 * https://github.com/ericsaboia/migrate-database
 *
 * Copyright (c) 2014 Eric Saboia
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    migrate: {
      path: 'migrations/',
      adapter: 'MongoDB',
      db: {
        host: '127.0.0.1',
        port: 27017,
        database: 'migrate',
        collection: 'schema_migrations'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
};
