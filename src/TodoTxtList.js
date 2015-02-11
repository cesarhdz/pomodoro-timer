var
todo = require('todo.txt'),
ENCODING = 'utf8'


function TodoTxtList(items){
	this.query = {
		sort: 'priority'
	}

	this.getItems = function(){ return items }
}

TodoTxtList.fs = require('fs')

TodoTxtList.parseFromFile = function(path){

	var str = TodoTxtList.fs.readFileSync(path, ENCODING)

	return TodoTxtList.parse(str)
}

TodoTxtList.parse = function(str){
    var 
    lines = str.replace("\r", "").split("\n"),

    items = lines.map(function(i){
    	return new todo.TodoItem(i)
    })

    return new TodoTxtList(items)
}


TodoTxtList.prototype.completed = function(){
	this.query.completed = true
	return this
}


TodoTxtList.prototype.pending = function(){
	this.query.completed = false
	return this
}

TodoTxtList.prototype.findAll  = function(query){
	var list = this

	query = query || this.query

	return this.getItems()
			.filter(function(i){ return list.$filter(i) })
			.sort(list.$compare)
}

TodoTxtList.prototype.$compare = function(a,b){
	// Unify priority
	var 
	ap = a.priority || '~',
	bp = b.priority || '~'

	if(ap != bp) return (ap > bp ) ? 1 : -1;

	return 0
}


TodoTxtList.prototype.$filter = function(item){

	var q = this.query


	if(q.completed != undefined){
		var done = item.text[0] == 'x'

		if(q.completed && !done) return false
		if(!q.completed && done) return false
	}

	
	return true
}



module.exports = TodoTxtList