var 
pomo = require('../src/index'),
fsMock = require('mock-fs'),
where = require('cases')


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


	describe('#pending.findAll', function(){
		it('Should filter by completed tasks', where([
			[3, ['(B) 1st task', '(A) 2nd taks', 'xtended task', 'x 2015-02-03 done']],
			[5, [
				'x 2015-02-05 task',
				'(D) task +project',
				'(B) task',
				'(A) 2015-02-03 task +project @hw',
				'2015-02-03 task +lukaz @hw',
				'(C) 2015-02-03 task +project @hw',
			]]
		],
		function(count, tasks){
			// given
			var todo = Service.parse(tasks.join("\n"))

			//when
			result  = todo.pending().findAll()

			// then
			result[0].priority.should.equal('A')
			result[1].priority.should.equal('B')
			result.length.should.equal(count)
		}))
	})
})


