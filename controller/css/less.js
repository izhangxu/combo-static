
'use strict';

const less = require('less');

class Less{
	constructor(data){
		this.handleJs(data);
	}

	handleJs(data){
		less.render(data,{
	      compress: false 
	    },function (e, output) {
	       console.log(output.css);
	    });
	}

	out(data){
		console.log(data);
	}
}

module.exports = Less;