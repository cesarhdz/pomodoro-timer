'use strict'

var
Promise = require('promise'),
path = require('path'),
todo = require('todo.txt')




function Reporter(){
}

function groupByProject(tasks){

	return tasks.reduce(function(acc, task){

		task.projects.forEach(function(p){
			var counter = acc[p] || 0;

			acc[p] = counter + 1;
		})

		return acc;

	}, {});

}

Reporter.prototype.byProject = function(file){

	var fs = this.fs


	return new Promise(function(resolve, reject){
		fs.readFile(file, 'utf8', function(err, data){

			if(err){
				reject(err)
				return
			}

			var tasks = data.split('\n').map(function(t){
				return new todo.TodoItem(t);
			});

			resolve(groupByProject(tasks));
		})
	});
}

Reporter.prototype.fs = require('fs')


module.exports = Reporter