var 
assert = require("assert"),
fsMock = require('mock-fs'),
moment = require('moment'),

chai = require('chai'),
chaiAsPromised = require("chai-as-promised"),

should = require('chai').should(),

pomo = require('../src/index');


chai.use(chaiAsPromised);


describe('Reporter', function(){

	var 
	service,
	result

	beforeEach(function(){
		result = null

		service = new pomo.Reporter('todo/')

		service.fs = fsMock.fs({
			'pomo.txt': [
				'2015-04-27T17:37:14 Task1 +projA',
				'2015-04-27T18:15:02 Task1 +projA',
				'2015-04-27T18:47:08 Task1 +projA',
				'2015-04-27T19:21:35 Task1 +projA',
				'2015-04-27T19:59:54 Task1 +projA',
				'2015-04-28T12:59:47 Task1 +projB',
				'2015-04-28T17:33:26 Task1 +projB',
				'2015-04-28T18:47:27 Task1 +projB',
				'2015-04-28T19:21:43 Task1 +projC +projA',
				'2015-04-28T19:54:34 Task1 +projC +projA',
				'2015-04-29T11:23:43 Task1 +projC +projA',
				'2015-04-29T11:59:48 Task1 +projD',
				'2015-04-29T13:30:25 Task1 +projD'
			].join('\n')
		})
	})


	describe('#report', function(){
		it('Should make a report groupped by projects', function(){

			//when
			result = service.byProject('pomo.txt')

			// then
			return result.then(function(data){
				data.projA.should.be.equal(8)
				data.projB.should.be.equal(3)
				data.projB.should.be.equal(3)
				data.projD.should.be.equal(2)
			})
		})
	})


})
