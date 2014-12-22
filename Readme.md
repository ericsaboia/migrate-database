# grunt-migrate

A grunt task for database migration in Node.JS
It has started as a fork of [node-migrate](https://github.com/tj/node-migrate), but has rebuilt from almost zero, and it's heavily inspired on Rails migrations style. 

# Why grunt-migrate?
1. Because the [currently most popular node migrate library](https://github.com/tj/node-migrate) was forgot in time, with many opened, and unsolved, [issues](https://github.com/tj/node-migrate/issues), since TJ is no longer envolved with node.js modules. 
2. It uses grunt for this CLI, which is far better than inject bins inside npm node modules.
3. It uses your database to store migrate histories, avoiding a bunch of possible issues
4. It uses timestamp in migration's name, good bye merges pain.
5. It was designed to plug any database through adapters.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-migrate --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-migrate');
```

## The "migrate" task

### Overview
In your project's Gruntfile, add a section named `migrate` to the data object passed into `grunt.initConfig()`.

```js
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
```

## Usage

### Creating migrations
Creates a new migration inside the migrate.path destination

```shell
$ grunt migrate:create --name migrations_name
```

The created migration will contain the following template structure:

```js
exports.up = function (next) {
  next(new Error('Not implemented'));
};

exports.down = function (next) {
  next(new Error('Not implemented'));
};
```

### Running migrations up
Runs all the pending migrations. 
You can pass --steps argument to limit the number of migrations to run.
fe
```shell
$ grunt migrate:up
```

### Running migrations down
Rollbacks the last migration
You can pass --steps argument to limit the number of migrations to run.

```
$ grunt migrate:down
```

## The library does not support my database!
Fear nothing, It's pretty simple to implement a new adapter, just follow the [existing mongodb adapter](https://github.com/ericsaboia/grunt-migrate/blob/master/tasks/lib/adapters/mongodb.js) methods.
Feel free to create a new adapter and pull-request it.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

0.1.0 / 2014-12-22
_____________
 * Used grunt for the CLI
 * Used timestamp for migrations name
 * Fixed error handler
 * Cloned node-migrate

## License 

(The MIT License)

Copyright (c) 2014 Eric Saboia esaboia@gmal.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
