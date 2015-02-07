var
chalk = require('chalk')


function Timer(){}


Timer.toMinutes = function(time){
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


Timer.prototype.buildTimer = function(label, color){ return function(time){
  var
  times = 0, 
  interval = 1 * 1000, // Update every minute
  total =  Timer.toMinutes(time),

  cb = setInterval(function(){
    times++
    
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(
      "| [" + label + '] => ' + chalk[color](' ' + Timer.toMinutes(times * interval)  + ' ')
    )

  }, interval)

  setTimeout(function(){
    clearInterval(cb)
  }, time)

}}

Timer.prototype.connect = function(app){
	app.on('task.start', this.buildTimer('Task', 'bgGreen') )
	app.on('shortBreak.start', this.buildTimer('Break', 'bgYellow'))
}


module.exports = Timer

