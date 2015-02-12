/**
 * Wrapper para facilitar la configuracion
 */
function Config(namespace, defaults){
	
	this.getNamespace = function(){ return namespace }

	this.defaults = defaults || {}
}

/**
 * Uses Rc loader, see: https://github.com/dominictarr/rc
 */
Config.prototype.configLoader = require('rc')

Config.prototype.load = function(){
	return this.configLoader(this.getNamespace(), this.defaults)
}

module.exports = Config