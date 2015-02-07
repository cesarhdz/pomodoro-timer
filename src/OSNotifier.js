var
notifier = require('node-notifier'),
path     = require('path'),
cliTimer = require('./CliTimer')

icon = path.join(__dirname, '..', 'assets', 'pomodoro-timer.png')


function OSNotifier(){
	this.useSounds = true
	this.reminderTime = 60 //seconds
}


/**
 * Wrapper to generate notifications using notifier.noty
 * Adds paths to assets and adds a sound to
 * the notification when useSound is true
 *
 * @param  {notification} notification
 * @arg    {String} title   
 * @arg    {String} message 
 * @arg    {String} sound   
 */
OSNotifier.prototype.notify = function(notification){
	notification.icon = icon
	notification.sound = (this.useSounds && notification.sound) 

	return notifier.notify(notification)
}


OSNotifier.prototype.connect = function(app){

	var 
	taskReminder,
	osNotifier = this

	app.on('task.timeover.notification', function(timeLeft, task){
	  osNotifier.notify({
	  	title: 'Tic Tac!',
	    message: 'You have ' +  cliTimer.toMinutes(timeLeft) + ' minutes to complete your task!', 
	    sound: true
	  })
	})

	app.on('shortBreak.start', function(time){
	  osNotifier.notify({ 
	  	title: 'Break time',
	    message: 'It\'s time to have a Break!', 
	  })
	})


	app.on('shortBreak.timeover', function(){
	  osNotifier.notify({
	  	title:'Break Time is over',
	    message: 'You have to get back to work!', 
	    sound: true
	  })

	  // Notify when break time is over, but you haven't choose a task
	  taskReminder = setInterval(function(){
	    osNotifier.notify({
	      title:'Are you still there?',
	      message: "You haven't choose any task to work with",
	      sound: true
	    })
	  }, osNotifier.reminderTime * 1000)
	})


	app.on('task.start', function(){
	  if(taskReminder) clearInterval(taskReminder)
	})
}


module.exports = OSNotifier