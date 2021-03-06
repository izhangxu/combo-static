
'use strict';

const browserify = require('browserify');
const iconv = require('iconv-lite');
const event = require('../../lib/util').event;

class Common{
    constructor (files, suffix, fn) {
        this.fn       = fn;
        this.suffix   = suffix;
        this.depFiles = [];
        this.handleJs(files)
    }

    handleJs (files) {
        let r_instance = browserify(files);
        r_instance.bundle( (err, buf) => {
            if ( !err ) {
                if ( Buffer.isBuffer(buf) ) {
                    event.emit("compileData",this.fn, this.suffix, iconv.decode(buf, 'utf8'), this.depFiles)
                }
            } else {
                event.emit("globalError", this.fn, util.getFinfo() + String(err))
            }
        })

        r_instance.on("file",function(file, id, parent){
            this.depFiles.push(file);
        }.bind(this))
    }
}

module.exports = Common;