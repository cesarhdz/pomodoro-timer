var 
inquirer = require("inquirer"),
ENCODING = 'utf8',
Promise = require("promise"),
todotxt = require('todo.txt'),
TodoTxtList = require('./TodoTxtList'),

chalk = require('chalk'),

TODO_FILE = 'todo.txt'

function TodoTxtProvider(app){
	this.list = null
	this.folder = app.config.path
	this.file = app.config.path + '/' + TODO_FILE


	this.colors = {
		A: 'yellow',
		B: 'cyan',
		C: 'magenta',
		none: 'gray'
	}
}

//@deprecated
TodoTxtProvider.name = 'todo-txt';

TodoTxtProvider.prototype.reload = function(path){
	this.todo = TodoTxtList.parseFromFile(this.file)
}

TodoTxtProvider.prototype.getRawList = function(){

	var provider = this

	return this
		.todo
		.pending()
		.findAll()
		.map(function(t, i){ 


			var 
			pri = t.priority ? '(' + t.priority + ') ' : '',
			msg = pri + t.text,
			color = provider.colors[t.priority] ? provider.colors[t.priority] : provider.colors.none

			return chalk[color](msg)
		})
}

TodoTxtProvider.prototype.promptTask = function(){

	var provider = this

	this.reload(this.path)

	return new Promise(function(resolve, reject){
		inquirer.prompt([{
			name: 'task',
			type: 'rawlist',
			message: 'Select a task',
			choices: provider.getRawList()
		}], function(args){
			resolve(args.task)
		})
	})
}


module.exports = TodoTxtProvider