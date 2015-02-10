var
fs = require('fs'),
dateFormat = require('dateformat'),


DATE_FORMAT = 'yyyy-mm-dd hh:MM:ss',
FILE = 'pomo.txt'


function Logger(){
	this.path = './'
}

Logger.prototype.connect = function(app){
	var logger = this

	this.path = app.config.path

	app.on('task.timeover', function(task){
		logger.write(task)
	})
}


Logger.prototype.write = function(task){
	//@TODO Remove priority and date
	var msg =  dateFormat(new Date(), DATE_FORMAT) + ' ' + task + "\n"

	fs.appendFile(FILE, msg, function (err){
		if(err) console.log(err)
	})
}


module.exports = Logger