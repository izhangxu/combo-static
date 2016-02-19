
'use strict';

const event = require('../../lib/util').event;
const config = require('../../config/index').js_module.AMD;
const base_path = require('../../config/index').base_path;
const log4js = require('../../config/log');
const requirejs = require('../../deps/r2.js');

class Amd{
	constructor(files,suffix,fn){
		let file = files.map(item => {
			return item.replace(new RegExp(base_path),'');
		})
		this.fn = fn;
		this.suffix = suffix;
		this.r_config = {};
		this.depFiles = [];
		this.r_config.include = file;
		this.r_config.out = this.out.bind(this);
		this.r_config.onBuildWrite = this.onBuildWrite.bind(this);
		Object.assign(this.r_config,config);
		this.handleJs();
	}

	handleJs(){
		requirejs.optimize(this.r_config, (buildResponse) => {
        }, err => {
        	log4js.logger_e.error(err.message || err.stack);
            event.emit("fileResult",this.fn,err)
        });
	}

	out(data){
		this.depFiles.shift();
		event.emit("compileData",this.fn,this.suffix,data,this.depFiles)
	}

	onBuildWrite(moduleName, path, contents){
		this.depFiles.push(path.replace(/^\.\//, ''));
		return contents;
	}
}

module.exports = Amd;

