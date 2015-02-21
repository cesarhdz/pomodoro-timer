require('array.prototype.find')

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


// Wrapper to TodoList.parseFromFile
TodoTxtProvider.prototype.load = function(file){
	return TodoTxtList.parseFromFile(file)
}

TodoTxtProvider.prototype.getRawList = function(todo){

	var provider = this

	/**
	 * Formats a task with colors based on priority
	 * @param  {task} t Task to be formatted
	 * @param  {i} i index
	 * @return {String}   Formatted task
	 */
	function format(t, i){
		var 
		pri = t.priority ? '(' + t.priority + ') ' : '',
		msg = pri + t.text,
		color = provider.colors[t.priority] ? provider.colors[t.priority] : provider.colors.none

		return chalk[color](msg)
	}


	return todo.pending().findAll().map(format)
}

TodoTxtProvider.prototype.findTask = function(str, todo){

	// Remove colors to find task
	var q = chalk.stripColor(str)

	return todo.getItems().find(function(t,i){
		return (q.indexOf(t.text) !== -1)
	})

}

TodoTxtProvider.prototype.promptTask = function(){

	var 
	self = this,
	todo = this.load(this.file),

	// Options to send to inquierer
	taskPrompt = {
		name:'task',
		type: 'rawlist',
		message: "Select a task\n",
		paginate: true,

		// Convert todo into a list with only text
		choices: this.getRawList(todo),

		// Converts rawText into a TodoTask
		filter: function(i){ return self.findTask(i, todo) }
	}

	
	//@TODO Append a new task or call reject
	if(! taskPrompt.choices){
		throw new Error('The file ' + chalk.cyan(this.file) + " doesn't contains any task")
	}

	return new Promise(function(resolve, reject){

		inquirer.prompt([taskPrompt], function(args){
			resolve(args.task)
		})
	})
}


module.exports = TodoTxtProvider