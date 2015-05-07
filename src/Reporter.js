'use strict'

var
Promise = require('promise'),
path = require('path'),
todo = require('todo.txt'),
moment = require('moment')




function Reporter(file){
	this.file = file
}


function Report(data, total){
	this.total = total
	this.data = data
}



function groupByProject(tasks){

	var data = tasks.reduce(function(acc, task){

		task.projects.forEach(function(p){
			var counter = acc[p] || 0;

			acc[p] = counter + 1;
		})

		return acc;

	}, {});


	// Total is not the sum because one task can belong to one or more projects
	return new Report(data, tasks.length)
}

function parse(data, start, end){

	var 
	lines = data.split('\n'),
	filtered = lines.filter(function(line){

		var date = getDate(line)

		if(start && moment(date).isBefore(start, 'day')){
			return false;
		}

		if(end && moment(date).isAfter(end, 'day')){
			return false;
		}

		return true;
	})


	return filtered.map(function(t){
		return new todo.TodoItem(t)
	})

}

function getDate(l){

	var t = l.slice(0, 19)

	return moment(t).toDate()
}


/**
 * Report by project with the given range of dates
 * @param  {Date} [start] 		
 * @param  {Date} [end]   
 * @return {Promise}       
 * @resolve {Object} Report
 */
Reporter.prototype.byProject = function(start, end){

	function parseDate(date){
		if(date){
			var m = moment(date)
			return m.isValid() ? m.toDate() : null
		}
	}

	start = parseDate(start)
	end = parseDate(end)


	var self = this;

	return new Promise(function(resolve, reject){
		self.fs.readFile(self.file, 'utf8', function(err, data){

			if(err){
				
				reject(err)

			}else{

				var tasks = parse(data, start, end)

				resolve(groupByProject(tasks));
			}
		})
	});
}


Reporter.prototype.prepareTasks = function(data, start, end){

	var tasks = data.split('\n')



}


Reporter.prototype.fs = require('fs')


module.exports = Reporter