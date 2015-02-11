var
fs = require('fs'),
moment = require('moment'),


DATE_FORMAT = "YYYY-MM-DD[T]hh:MM:ss",
FILE = 'pomo.txt'


function Logger(path){
	this.path = path || './'
}

Logger.prototype.connect = function(app){
	var logger = this

	this.path = app.config.path

	app.on('task.timeover', function(task){
		logger.write(task)
	})
}

Logger.prototype.fs = require('fs')

Logger.prototype.timestamp = function(task){
	return moment().format(DATE_FORMAT) + ' ' + task + "\n"
}

Logger.prototype.getFilePath = function(){
	return this.path + FILE
}

Logger.prototype.write = function(task){
	var 
	file = this.getFilePath(),
	msg = this.timestamp(task)

	this.fs.appendFile(file, msg, function (err){
		if(err) console.log(err)
	})
}


module.exports = Logger