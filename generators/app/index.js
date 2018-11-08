'use strict';
/* eslint-disable */

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const selectDirectory = require('inquirer-select-directory');
var shell = require('shelljs');
const humorize = require('./lib/humorize.js');

const templateOptions = [{
    name: 'twig',
    checked: true
  },
  {
    name: 'scss',
    checked: true
  },
  {
    name: 'config',
    checked: true
  },
  {
    name: 'js'
  },
  {
    name: 'readme'
  }
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Abort if a config file doesn't exist
    if (Object.keys(this.config.getAll()).length === 0) {
      this.log(yosay(`\n${chalk.red('Bummer!')} I can't find the config file...`));
      process.exit();
    }

    if (shell.which('git')) {
      let user = shell.exec('git config user.name', {
        silent: true
      }).replace(/\n/g, '');
      this.userFirstName = user.replace(/ .*/, '');
    }

    this.componentSettings = {
      path: this.config.get('componentsPath'),
      types: Object.keys(this.config.get('componentTypes')).map(
        object => this.config.get('componentTypes')[object]
      ),
      usePrefix: this.config.get('prefixComponents'),
      updateLoaderCMD: {
        cmd: this.config.get('updateLoaderCMD').cmd,
        args: Object.values(this.config.get('updateLoaderCMD').args)
      },
      updateIndexJs: {
        cmd: this.config.get('updateIndexJsCMD').cmd,
        commandPath: this.config.get('updateIndexJsCMD').cliPath,
      },
    };

    this.getComponent = function (name) {
      let component = this.componentSettings.types.find(component => {
        return component.name === name;
      });
      return component;
    };

    this.handlePrefixing = function (string, name) {
      let component = this.getComponent(name);
      return this.componentSettings.usePrefix === true ?
        `${component.prefix}-${string}` :
        string;
    };

    this.titleCase = function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    this.env.adapter.promptModule.registerPrompt('selectDirectory', selectDirectory);
  }

  initializing() {
    this.log(
      yosay(
        `${chalk.red(humorize.sayHello())} ${chalk.red(
          this.userFirstName ? this.userFirstName + '!' : `sexy!`
        )}\nLet's ${humorize.randomize('create')} a component, shall we???`
      )
    );
  }

  prompting() {
    const prompts = [{
        type: 'input',
        name: 'name',
        required: true,
        message: `What's the component name?`
      },
      {
        type: 'list',
        name: 'type',
        required: true,
        message: function (response) {
          return `What kind of element is '${response.name}'?`;
        },
        choices: this.componentSettings.types,
        default: this.componentSettings.types[0].name
      },
      {
        type: 'confirm',
        message: function (response) {
          return `Does it have variants?`;
        },
        name: 'addModifiers',
        default: false
      },
      {
        type: 'input',
        message: `Enter the names separated by a space:`,
        name: 'modifiers',
        required: true,
        when: function (response) {
          return response.addModifiers;
        },
        filter: function (response) {
          return response.split(' ');
        }
      },
      {
        type: 'checkbox',
        message: 'What templates do you need?',
        name: 'templates',
        choices: templateOptions
      },
      {
        type: 'confirm',
        message: `May I update the _components.scss for you?`,
        name: 'updateLoader',
        default: true
      },
      {
        type: 'confirm',
        message: `May I update index.js for you?`,
        name: 'updateIndex',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.component = {
        name: props.name,
        filename: this.handlePrefixing(props.name, props.type),
        type: props.type,
        modifiers: props.modifiers,
        templates: props.templates,
        updateLoader: props.updateLoader,
        updateIndex: props.updateIndex,
        path: `${this.componentSettings.path}/${
          this.getComponent(props.type).path
        }/${this.handlePrefixing(props.name, props.type)}/`
      };
    });
  }

  writing() {
    this.log(chalk.red('\nSit tight...\n'));

    // Twig
    if (this.component.templates.includes('twig')) {
      this.fs.copyTpl(
        this.templatePath('_component.twig'),
        this.destinationPath(`${this.component.path}/${this.component.filename}.twig`), {
          name: this.component.name,
          className: this.handlePrefixing(this.component.name, this.component.type),
          data: this.component.templates.includes('js') ? `data-${this.component.name}` : null
        }
      );
    }

    // Scss
    if (this.component.templates.includes('scss')) {
      this.fs.copyTpl(
        this.templatePath('_component.scss'),
        this.destinationPath(`${this.component.path}/_${this.component.filename}.scss`), {
          name: this.component.name,
          className: this.handlePrefixing(this.component.name, this.component.type),
          modifiers: this.component.modifiers
        }
      );
    }

    // Config
    if (this.component.templates.includes('config')) {
      this.fs.copyTpl(
        this.templatePath('_component.config.js'),
        this.destinationPath(
          `${this.component.path}/${this.component.filename}.config.js`
        ), {
          label: this.component.name.charAt(0).toUpperCase() + this.component.name.slice(1),
          className: this.handlePrefixing(this.component.name, this.component.type),
          modifiers: this.component.modifiers,
          data: this.component.templates.includes('js') ? this.component.name : ''
        }
      );
    }

    // Js
    if (this.component.templates.includes('js')) {
      this.fs.copyTpl(
        this.templatePath('_component.js'),
        this.destinationPath(`${this.component.path}/${this.component.filename}.js`), {
          name: this.titleCase(this.component.name)
        }
      );
    }

    // Readme
    if (this.component.templates.includes('readme')) {
      this.fs.copyTpl(
        this.templatePath('_README.md'),
        this.destinationPath(`${this.component.path}/README.md`), {
          name: this.titleCase(this.component.name),
        }
      );
    }
  }

  end() {
    if (this.component.updateLoader) {
      this.log(chalk.red('\nUpdating _components.scss...\n'));
      this.spawnCommandSync(
        this.componentSettings.updateLoaderCMD.cmd,
        this.componentSettings.updateLoaderCMD.args
      )
    }
    if (this.component.updateIndex) {
      this.log(chalk.red('\nUpdating index.js...\n'));
      this.spawnCommandSync(
        this.componentSettings.updateIndexJs.cmd,
        [this.componentSettings.updateIndexJs.commandPath, this.getComponent(this.component.type).path, this.component.name]
      )
    }
    this.log(yosay(`\n\n${chalk.green('Sweet!')} ${humorize.sayGoodbye()}\n`));
  }
};
