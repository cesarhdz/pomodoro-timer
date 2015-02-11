var 
assert = require("assert"),
fsMock = require('mock-fs'),
should = require('chai').should(),
moment = require('moment'),

pomo = require('../src/index')



describe('Logger', function(){

	var 
	task,
	service,
	result,
	fs

	beforeEach(function(){
		task = 'Demo task'
		result = null

		fs = fsMock.fs({
			'todo' : {
				'pomo.txt': ''
			}
		})

		service = new pomo.Logger('todo/')
		service.fs = fs
	})


	describe('#timestamp', function(){
		it('Should add timestamp to task', function(){
			// when
			result = service.timestamp(task)

			//then
			result.indexOf(task).should.be.within(18,22)

			//and
			var date = moment(result.split(' ')[0])
			date.isSame(new Date(), 'day').should.be.true
		})

	})


  describe('#write', function(){
  	// fsMock.appendFile doesn't write content to file
    xit('Should append a line to a file', function(){
    	// When
    	service.write(task)

    	//then
    	fs.readFileSync('todo/pomo.txt', 'utf8').should.contain(task)
    })

  })
})
