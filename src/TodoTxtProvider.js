var 
TodoList = require ('todotxt-coffee').TodoList,
inquirer = require("inquirer"),
fs = require('fs'),
ENCODING = 'utf8',
Promise = require("promise")


function TodoTxtProvider(pomodoro){
	this.list = null
	this.path = null
}


TodoTxtProvider.name = 'todo-txt';

TodoTxtProvider.prototype.init = function(){
	var provider = this
	
	return new Promise(function(resolve, rejct){
		inquirer.prompt([{
			name: 'path',
			type: 'input',
			message: "Please insert the path to the todo.txt file you want to use\n",
			validate: function(path){
				if(! fs.existsSync(path)) return "File [" + path + "] doesn't exists"

				var tasks = new TodoList(path)
				
				return (tasks.list.length ) ? true : "The file doesn't have a valid syntax or any task"
			}
		}], function(args){
			//@TODO avoid exceptions when path is not found and prompt again
			provider.path = args.path
			provider.reload(args.path)

			resolve(provider)
		})
	})
}


TodoTxtProvider.prototype.reload = function(path){
	this.list = new TodoList(path)
}

TodoTxtProvider.prototype.getRawList = function(){
	return this.list.list.map(function(t, i){ 
		return t.raw().replace("\r", '')
	})
}

TodoTxtProvider.prototype.promptTask = function(){

	var provider = this

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