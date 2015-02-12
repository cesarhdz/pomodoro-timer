var
events = require('events'),
Config = require('./Config'),
TaskProvider = require('./TodoTxtProvider'),


MINUTES = 60000,

APP_NAME = 'pomotxt',

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

	// Current path
	path: './'
}


var App = function App(){
	// Inherit bus behavior
	var 
	bus = new events.EventEmitter(),
	config = new Config(APP_NAME, defaults)


	this.on = bus.on
	this.emit = bus.emit

	this.config = config.load()
	this.taskProvider = new TaskProvider(this)

	console.log(this.config)
}

App.prototype.version = require('../package').version


App.prototype.startTask = function(){

	var 
	app = this,
	time = this.config.task * MINUTES,
	notification = time - (this.config.notification * MINUTES)

	// Prompt task
	this.taskProvider.promptTask()


	// Starts a new task
	.then(function(task){
		app.emit('task.start', time, task)

		// Send notification
		setTimeout(function(){
			app.emit('task.timeover.notification', app.config.notification * MINUTES, task)
		}, notification)

		// When task is completed, its sent
		setTimeout(function(){
			app.emit('task.timeover', task)
			app.startBreak()
		}, time)
	})

}

App.prototype.startBreak = function(){
	//@TODO Determine if break is short or long
	var
	app = this,
	time = this.config.shortBreak * MINUTES

	app.emit('shortBreak.start', time)

	setTimeout(function(){
		app.emit('shortBreak.timeover')
		app.startTask()
	}, time)

}



App.prototype.run = function(){
	
	var app = this

	app.emit('app.start')
	app.startTask()
}



module.exports = App