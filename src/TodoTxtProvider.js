'use strict'

require('array.prototype.find')

var 
inquirer = require('inquirer'),
Promise = require('promise'),
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
	//@TODO Check if file exists to avoid throwing meaningless error
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
	function format(t){
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

	return todo.getItems().find(function(t){
		return (q.indexOf(t.text) !== -1)
	})

}

/**
 * Looks for a task with the given number
 * @param  {Integer} number Task number, task are ordered by line order as todo.txt do
 * @return {Promise}
 * @resolve {Function<Task>} If a task is found, then the task is returned
 * @reject {error} Return error is task not found
 */
TodoTxtProvider.prototype.getTask = function(number){
	// The number is decreased by one to match array notation
	var 
	search = number - 1,
	self = this

	return new Promise(function(resolve, reject){

		// The we load the item
		var items = self.load(self.file).getItems()

		if(items[search]){ resolve(items[search]) }

		else{ reject('No task found with number ' + number) }
	})
}


/**
 * Mark a task as done
 * @param  {Task} task Task to be marked as done
 * @return {Promise}      
 * @resolve {vooid} If task is successfully marked as done
 * @reject {error} If any erro ocurr
 */
TodoTxtProvider.prototype.markAsDone = function(task){
	return new Promise(function(resolve, reject){
		reject('@TODO Mark as done is not implemented, you have to do it manually')
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
		message: 'Select a task\n',
		paginate: true,

		// Convert todo into a list with only text
		choices: this.getRawList(todo),

		// Converts rawText into a TodoTask
		filter: function(i){ return self.findTask(i, todo) }
	}

	
	//@TODO Append a new task or call reject
	if(! taskPrompt.choices){
		throw new Error('The file ' + chalk.cyan(this.file) + ' doesn\'t contains any task')
	}

	return new Promise(function(resolve, reject){
		inquirer.prompt([taskPrompt], function(args){
			resolve(args.task)
		})
	})
}


module.exports = TodoTxtProvider