var
notifier = require('node-notifier'),
path     = require('path'),


icon = path.join(__dirname, '..', 'assets', 'pomodoro-timer.png')



function toMinutes(time){
  var 
  sec = time / 1000 % 60,
  min = parseInt(time / 1000 / 60)

  function pad(str){
    var 
    format = '00',
    str = str + ''

    return format.substring(0, format.length - str.length) + str
  }

  return  pad(min) + ":" + pad(sec)
}


function OSNotifier(){}


OSNotifier.prototype.connect = function(app){

	app.on('task.timeover.notification', function(timeLeft, task){
	  notifier.notify({ 
	  	title: 'Tic Tac!',
	    message: 'You have ' +  toMinutes(timeLeft) + ' minutes to complete your task!', 
	    icon: icon 
	  })
	})


	app.on('shortBreak.start', function(time){
	  // Growl notification
	  notifier.notify({ 
	  	title: 'Break time',
	    message: 'It\'s time to have a Break!', 
	    icon: icon
	  })
	})


	app.on('shortBreak.timeover', function(){
	  // Growl notification
	  notifier.notify({
	  	title:'Break Time is over',
	    message: 'You have to get back to work!', 
	    icon: icon
	  })
	})


	var taskReminder

	app.on('shortBreak.timeover', function(){
	  // Notify when break time is over, but you haven't choose a task
	  taskReminder = setInterval(function(){
	    notifier.notify({
	      title:'Are you still there?',
	      message: "You haven't choose any task to work with",
	      icon:icon
	    })
	  }, 60 * 1000)
	})


	app.on('task.start', function(){
	  if(taskReminder) clearInterval(taskReminder)
	})

}



module.exports = OSNotifier