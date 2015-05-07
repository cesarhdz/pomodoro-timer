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

Report.prototype.toTable = function(){

	var data = this.data

	return Object.keys(data).map(function(k){
        return [k, data[k]];
    })
}

function groupByProject(acc, task){
	task.projects.forEach(function(p){
		var counter = acc[p] || 0;

		acc[p] = counter + 1;
	})

	return acc;
}


function groupByTask(acc, task){
	var 
	key = task.text,
	counter = acc[task] || 0;

	acc[key] = counter + 1

	return acc;
}


function splitTasks(lines){
	return 	lines.split('\n');
}


/**
 * Return a funtion that will filter raw lines
 * @param  {Object} query 
 * @return {Function}       filter
 */
function preFilter(query){

	function parseDate(date){
		if(date){
			var m = moment(date)
			return m.isValid() ? m.toDate() : null
		}
	}

	function getDate(l){
		var t = l.slice(0, 19)

		return moment(t).toDate()
	}

	var
	start = parseDate(query.from),
	end = parseDate(query.to)

	return function(line){
		// Remove empty lines
		if(line.trim() === '') return

		var date = getDate(line)

		if(start && moment(date).isBefore(start, 'day')){
			return false;
		}

		if(end && moment(date).isAfter(end, 'day')){
			return false;
		}

		return true;
	}
}

function parse(data, filter){
	var lines = splitTasks(data)

	return lines
			.filter(filter)
			.map(function(t){ return new todo.TodoItem(t)})
}


/**
 * Report by project with the given range of dates
 * @param  {Date} [start] 		
 * @param  {Date} [end]   
 * @return {Promise}       
 * @resolve {Report} Report Object with data and totals
 */
Reporter.prototype.report = function(query){

	query = query || {}

	var self = this;

	return new Promise(function(resolve, reject){
		self.fs.readFile(self.file, 'utf8', function(err, data){

			if(err){
				reject(err)
			}else{

				var 
				tasks = parse(data, preFilter(query)),

				data = tasks.reduce(groupByProject, {})

				// Total is not the sum because one task can belong to one or more projects
				resolve(new Report(data, tasks.length));
			}
		})
	});
}


Reporter.prototype.fs = require('fs')


module.exports = Reporter