'use strict'

var
events = require('events'),
Config = require('./Config'),
TaskProvider = require('./TodoTxtProvider'),
inquirer = require("inquirer"),
chalk = require('chalk'),


MINUTES = 60000,

APP_NAME = 'pomotxt',

// Variable to use same dir if is given in TODO.txt
TODO_DIR_VAR = 'TODO_DIR',

defaults = {
	
	// Minutes a task will last (pomodoro)
	task: 25,
	
	// Minutes Short interval will last
	shortBreak: 5,
	
	// minutes long break interval will last
	longBreak: 15,

	// After (n) intervals elapsed, a longBreak will be used
	shortIntervals: 5,

	// Notification before task time ends
	notification: 5,

	// Show a reminder {n} minutes if no task is selected
	reminder: 2,

	// TODO_DIR path or current path as default
	path:  process.env[TODO_DIR_VAR] || './'
}


function App(){
	// Inherit bus behavior
	var 
	bus = new events.EventEmitter(),
	config = new Config(APP_NAME, defaults)

	this.on = bus.on
	this.emit = bus.emit

	this.config = config.load()
	this.taskProvider = new TaskProvider(this)
}

App.version = require('../package').version


/**
 * Start a timer of a given task 
 * If tasknumber is not given, a dropdown will be prompted to choose one
 * 
 * @param  {Integer} taskNumber Task number, same order todo.txt have
 * @return {void}            
 */
App.prototype.startTask = function(taskNumber){

	var self = this,

	// Prompt task or get directly
	promise =  taskNumber 
				? this.taskProvider.getTask(taskNumber) 
				: this.taskProvider.promptTask()

	// Starts a new task
	promise.then(function(task){
		self.runTask(task)
	})
}


App.prototype.runTask = function(task){

	var
	self = this,
	time = this.config.task * MINUTES,
	notification = time - (this.config.notification * MINUTES)

	this.emit('task.start', time, task)

	// Send notification
	setTimeout(function(){
		self.emit('task.timeover.notification', self.config.notification * MINUTES, task)
	}, notification)

	// When task is completed, its sent
	setTimeout(function(){
		self.emit('task.timeover', task)
		self.startBreak(task)
	}, time)
}

App.prototype.startBreak = function(task){
	//@TODO Determine if break is short or long
	var
	self = this,
	time = this.config.shortBreak * MINUTES

	this.emit('shortBreak.start', time, task)

	setTimeout(function(){
		self.emit('shortBreak.timeover')
		self.resumeOrFinishTask(task)
	}, time)

}


/**
 * Action called after break time is finished
 * Shows a prompt to the user to decide what to next:
 * 	- Resume task
 * 	- Stop timer
 * 	- Stop timer and mark task as done
 * 	
 * @param  {Task} task Task currently working
 * @return {void}      
 */
App.prototype.resumeOrFinishTask = function(task){

	var	
	key = 'taskResume',
	self = this,

	taskPrompt = {
	    type: 'expand',
    	message: 'Time is over, What\'s nex? \n  '  + chalk.yellow(task.text) + '\n  ',
    	name: key,
    	choices: [
	      	{
		        key: 'r',
		        name: 'Resume task',
		        value: function(task){ 
		        	self.runTask(task)
		        }
	      	},
	      	{
	      		key: 's',
	      		name: 'Stop Timer',
	      		value: process.exit
	      	},
	      	{
	      		key: 'x',
	      		name: 'Stop Timer and mark task as done',
	      		value: function(task){
	      			self.taskProvider.markAsDone(task)
	      				.then(function(){
	      					process.exit()
	      				}, function(error){
	      					console.log(error)
	      					process.exit()
	      				})
	      		}
	      	}
		],

		// Set help by default to avoid typos
		default: 3
	}

	inquirer.prompt([taskPrompt], function(args){
		var fn = args[key]

		fn(task)
	})
}


/**
 * Deprecated
 * It makes app complex,, directly selecting the task is faster
 * and more efficient
 * @return {void} 
 */
App.prototype.run = function(){
	
	var app = this

	app.emit('app.start')
	app.startTask()
}



module.exports = App