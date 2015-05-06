'use strict'

var
Promise = require('promise'),
path = require('path')




function Reporter(){
}

function buildReport(data){

	var lines = data.split('\n');

	return {
		totalCount: lines.length
	}
}

Reporter.prototype.report = function(file){

	var fs = this.fs


	return new Promise(function(resolve, reject){
		fs.readFile(file, 'utf8', function(err, data){

			if(err){
				reject(err)
				return
			}


			resolve(buildReport(data));
		})
	});
}

Reporter.prototype.fs = require('fs')


module.exports = Reporter