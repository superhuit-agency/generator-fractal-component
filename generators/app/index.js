'use strict';
/* eslint-disable */

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const selectDirectory = require('inquirer-select-directory');
var shell = require('shelljs');
const humorize = require('./lib/humorize.js');

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
			path: this.config.get('componentsDest'),
			types: Object.keys(this.config.get('componentTypes')).map(
				object => this.config.get('componentTypes')[object]
			),
			usePrefix: this.config.get('prefixComponents'),
			hookAfterChange: this.config.get('hookAfterChange'),
			templates: this.config.get('componentsTemplates'),
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
		const initialPrompts = [{
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
				message: 'Which templates do you need?',
				name: 'templates',
				choices: this.componentSettings.templates
			},
			{
				type: 'confirm',
				message: `May I run some magic for you (the commands configured in "hookAfterChange")?`,
				name: 'runHookAfterChange',
				default: true
			},
		];

		return this.prompt(initialPrompts).then(props => {
			this.component = {
				name: props.name,
				label: this.titleCase(props.name),
				filename: this.handlePrefixing(props.name, props.type),
				type: props.type,
				className: this.handlePrefixing(props.name, props.type),
				modifiers: props.modifiers,
				hasJS: props.templates.includes('js'),
				templates: props.templates,
				runHookAfterChange: props.runHookAfterChange,
				path: `${this.componentSettings.path}/${
					this.getComponent(props.type).path
				}/${this.handlePrefixing(props.name, props.type)}/`,
				// relative path that could be used to update a loader file for example
				typePath: this.getComponent(props.type).path
			};
		});
	}

	writing() {
		this.log(chalk.red('\nSit tight...\n'));

		this.componentSettings.templates.forEach((tpl) => {
			// bail if template not selected by user
			if (!this.component.templates.includes(tpl.name)) return;

			// get filename from source, replace _component by component name
			let filename = tpl.path.split('/');
			filename = filename[filename.length-1].replace('_component', `_${this.component.filename}`);

			// copy template
			this.fs.copyTpl(
				this.destinationPath(tpl.path),
				this.destinationPath(`${this.component.path}/${filename}`),
				this.component
			);
		});
	}

	end() {

		// run hook: afterChange
		if (this.component.runHookAfterChange && this.componentSettings.hookAfterChange) {
			this.componentSettings.hookAfterChange.forEach(hook => {
				// vars
				const cmd = hook.cmd;

				// replace dynamic args
				// ex: `<%= name %>` will be replaced with the name of the component
				const args_re = new RegExp(`(\<\%\=\s+)(${Object.keys(this.component).join('|')})(\s+\%\>)`, 'gi');
				const args = !hook.args ? [] : hook.args.map((arg) => {
					return arg.replace(args_re, (match, prefix, key, suffix) => this.component[key[2]]);
				});

				// run command
				this.log(chalk.red(`\nRunning hook '${cmd} ${args.join(' ')}'\n`));
				this.spawnCommandSync(
					cmd,
					args
				);
			});
		}

		// done!
		this.log(yosay(`\n\n${chalk.green('Sweet!')} ${humorize.sayGoodbye()}\n`));
	}
};
