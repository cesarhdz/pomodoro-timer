var 
pomo = require('../src/index'),
fsMock = require('mock-fs')




describe('TodoTxtProvider', function(){

	var
	service,
	result

	beforeEach(function(){
		service = new pomo.TdoTxtProvider()
		service.fs = fsMock({})
	})

	describe('#loadTask', function(){
		it('Should load tasks from file')
	})
})
// provider.init().then(function(provider){
// 	provider.promptTask()
// })


