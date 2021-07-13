"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pandoc = void 0;
const child_process_1 = require("child_process");
class Pandoc {
    constructor(inputMarkup, outputMarkups) {
        this.inputType = "";
        this.outputTypes = [];
        this.outLength = 0;
        if (!inputMarkup || typeof inputMarkup !== "string") {
            throw "Invalid source markup. Type: must be a string.";
        }
        if (typeof outputMarkups !== "string" && !Array.isArray(outputMarkups)) {
            throw "Invalid destination types: must be a string or an array of strings.";
        }
        if (outputMarkups.length <= 0) {
            throw "No destination types provided (empty array).";
        }
        this.inputType = inputMarkup;
        this.outputTypes = Array.isArray(outputMarkups)
            ? outputMarkups
            : [outputMarkups];
        this.outLength = outputMarkups.length;
        this.data = {};
    }
    convert(inputText, callback) {
        let outLength = 0;
        if (!inputText || typeof inputText !== "string") {
            throw "Invalid markup type: must be a string.";
        }
        if (typeof callback !== "function") {
            if (callback) {
                throw "Invalid callback provided: must be a function.";
            }
            else {
                throw "No callback provided: must be a function.";
            }
        }
        for (const type of this.outputTypes) {
            const args = [];
            args.push("-f", this.inputType, "-t", type.name);
            if (type.fname) {
                args.push("-o", type.fname);
            }
            var pandoc = child_process_1.spawn("pandoc", args);
            pandoc.stdout.targetType = type;
            pandoc.stdout.on("data", (data) => {
                if (!this.data)
                    this.data = {};
                if (!this.data[type.name]) {
                    this.data[type.name] = Buffer.alloc(0);
                }
                this.data[type.name] = Buffer.concat([this.data[type.name], data]);
            });
            pandoc.on("error", (err) => {
                callback(null, err);
            });
            pandoc.on("exit", (code, signal) => {
                outLength++;
                if (code !== 0) {
                }
                else if (outLength === this.outLength) {
                    callback(this.manageOut(this.data), null);
                }
            });
            pandoc.stdin.write(inputText, "utf8");
            pandoc.stdin.end();
        }
    }
    convertFile(fname, callback) {
        let outLength = 0;
        if (!fname || typeof fname !== "string") {
            throw "Invalid filename: must be a string.";
        }
        if (typeof callback !== "function") {
            if (callback) {
                throw "Invalid callback provided: must be a function.";
            }
            else {
                throw "No callback provided: must be a function.";
            }
        }
        for (const type of this.outputTypes) {
            const args = [];
            args.push("-f", this.inputType, "-t", type.name, fname);
            if (type.fname) {
                args.push("-o", type.fname);
            }
            var pandoc = child_process_1.spawn("pandoc", args);
            pandoc.stdout.targetType = type;
            pandoc.stdout.on("data", (data) => {
                if (!this.data[type.name]) {
                    this.data[type.name] = Buffer.alloc(0);
                }
                this.data[type.name] = Buffer.concat([this.data[type.name], data]);
            });
            pandoc.on("error", (err) => {
                callback(null, err);
            });
            pandoc.on("exit", (code, signal) => {
                outLength++;
                if (code !== 0) {
                }
                else if (outLength === this.outLength) {
                    callback(this.manageOut(this.data), null);
                }
            });
        }
    }
    convertAsync(inputText) {
        return new Promise((resolve, reject) => {
            this.convert(inputText, (data, err) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    convertFileAsync(fname) {
        return new Promise((resolve, reject) => {
            this.convertFile(fname, (data, err) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    manageOut(data, enc) {
        const _d = {};
        for (const _t of this.outputTypes) {
            if (_t.fname) {
                _d[_t.name] = _t.fname;
            }
            else {
                if (_t.outBin === true) {
                    _d[_t.name] = data[_t.name];
                }
                else {
                    _d[_t.name] = data[_t.name].toString(_t.enc || "utf-8");
                }
            }
        }
        return _d;
    }
}
exports.Pandoc = Pandoc;
//# sourceMappingURL=pandoc.js.map