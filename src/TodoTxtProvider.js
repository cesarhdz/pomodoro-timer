var 
TodoList = require ('todotxt-coffee').TodoList,
inquirer = require("inquirer"),
fs = require('fs'),
ENCODING = 'utf8',
Promise = require("promise")


function TodoTxtProvider(app){
	this.list = null
	this.path = app.config.path
}


TodoTxtProvider.name = 'todo-txt';


TodoTxtProvider.prototype.reload = function(path){
	this.list = new TodoList(path)
}

TodoTxtProvider.prototype.getRawList = function(){
	return this.list.list.map(function(t, i){ 
		return t.raw().replace("\r", '')
	}).sort()
}

TodoTxtProvider.prototype.promptTask = function(){

	var provider = this

	this.reload(this.path)

	return new Promise(function(resolve, reject){
		inquirer.prompt([{
			name: 'task',
			type: 'rawlist',
			message: 'Select a task',
			choices: provider.getRawList()
		}], function(args){
			resolve(args.task)
		})
	})
}


module.exports = TodoTxtProvider