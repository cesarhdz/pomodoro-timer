var 
pomo = require('../src/index'),
fsMock = require('mock-fs')


describe('TodoTxtList', function(){

	var
	result,
	Service = pomo.TodoTxtList

	beforeEach(function(){
		Service.fs = fsMock.fs({
			demo:{ 'todo.txt': ['Task 1', 'Task 2', 'Task 3'].join("\n") }
		})
	})

	describe('#parseFromFile', function(){
		it('Should load tasks from file', function(){
			// when
			result = Service.parseFromFile('demo/todo.txt')

			// then
			result.getItems().length.should.equal(3)
		})
	})
})

