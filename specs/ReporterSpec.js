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

		service = new pomo.Reporter('pomo.txt')

		service.fs = fsMock.fs({
			'pomo.txt': [
				'2015-04-24T17:37:14 Task1 +projA',
				'2015-04-24T18:15:02 Task1 +projA',
				'2015-04-24T18:47:08 Task1 +projA',

				'2015-04-25T19:21:35 Task1 +projA',
				'2015-04-25T19:59:54 Task1 +projA',
				'2015-04-25T12:59:47 Task2 +projB',
				'2015-04-25T17:33:26 Task2 +projB',
				'2015-04-26T18:47:27 Task2 +projB',
				'2015-04-26T19:21:43 Task2 +projC +projA',

				'2015-04-27T19:54:34 Task3 +projC +projA',
				'2015-04-28T11:23:43 Task3 +projC +projA',
				'2015-04-29T11:59:48 Task3 +projD',
				'2015-04-29T13:30:25 Task3 +projD'
			].join('\n')
		})
	})


	describe('#report', function(){
		it('Should make a report groupped by projects', function(){

			//when
			result = service.report()

			// then
			return result.then(function(report){

				report.total.should.equal(13)

				report.data.projA.should.equal(8)
				report.data.projB.should.equal(3)
				report.data.projB.should.equal(3)
				report.data.projD.should.equal(2)
			})
		})


		it('Should filter by start date', function(){

			result = service.report({from : '2015-04-25'})

			//then
			return result.then(function(report){

				report.total.should.equal(10)

				report.data.projA.should.equal(5)
				report.data.projB.should.equal(3)
			})

		})


		it('Should filter by end date', function(){

			result = service.report({to:'2015-04-26'})

			//then
			return result.then(function(report){

				report.total.should.equal(9)

				report.data.projA.should.equal(6)
				report.data.projB.should.equal(3)
			})

		})


		it('Should return a table friendly result', function(){

			result = service.report({from: '2015-04-27'})

			return result.then(function(report){
				report.toTable()[0][0].should.equal('projC')
				report.toTable()[0][1].should.equal(2)
				report.toTable().length.should.equal(3)
			})

		})


		it('Should group by tasks', function(){

			result = service.report({groupBy: 'task'})


			return result.then(function(report){
				
				report.total.should.equal(13)

				report.data['Task1 +projA'].should.equal(5)

			})

		})


		it('Should query simple string', function(){

			result = service.report({q: 'Task3'})

			return result.then(function(report){

				report.total.should.equal(4)

			})

		})
	})


})
