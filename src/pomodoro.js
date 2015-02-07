var events = require('events')
  , extend = require('util')._extend
  , MINUTES = 60000
  , TaskProvider = require('./TodoTxtProvider')


var Pomodoro = function Pomodoro(config){

	var defaults = {
		task: 25,
		shortBreak: 5,
		longBreak: 15,
		shortIntervals: 5,
		notification: 5
	}

	// Inherit bus behavior
	var bus = new events.EventEmitter()

	this.on = bus.on
	this.emit = bus.emit

	this.config = extend(defaults, config)
	this.taskProvider = new TaskProvider(this)

}


Pomodoro.prototype.startTask = function(){

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

Pomodoro.prototype.startBreak = function(){
	//@TODO Determine if break is short or long
	//
	
	var
	app = this,
	time = this.config.shortBreak * MINUTES

	app.emit('shortBreak.start', time)

	setTimeout(function(){
		app.emit('shortBreak.timeover')
		app.startTask()
	}, time)

}



Pomodoro.prototype.run = function(){
	
	var app = this

	app.emit('app.start')

	this.taskProvider.init().then(function(){
		app.startTask()
	})

}



module.exports = Pomodoro