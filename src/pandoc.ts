import { spawn } from "child_process";
import { PandocOutFormat } from "./input-format";
import { PandocCallback, PandocData } from "./types";

export class Pandoc {
  private data: { [format: string]: Buffer };
  private inputType: string = "";
  private outputTypes: PandocOutFormat[] = [];
  private outLength: number = 0;

  constructor(
    inputMarkup: string,
    outputMarkups: PandocOutFormat | PandocOutFormat[]
  ) {
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

  public convert(inputText: string, callback: PandocCallback): void {
    let outLength = 0;
    if (!inputText || typeof inputText !== "string") {
      throw "Invalid markup type: must be a string.";
    }

    if (typeof callback !== "function") {
      if (callback) {
        throw "Invalid callback provided: must be a function.";
      } else {
        throw "No callback provided: must be a function.";
      }
    }

    for (const type of this.outputTypes) {
      const args: string[] = [];
      args.push("-f", this.inputType, "-t", type.name);
      if (type.fname) {
        args.push("-o", type.fname);
      }
      var pandoc = spawn("pandoc", args);
      (pandoc.stdout as any).targetType = type;

      pandoc.stdout.on("data", (data: Buffer) => {
        if (!this.data) this.data = {};
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
        } else if (outLength === this.outLength) {
          callback(this.manageOut(this.data), null);
        }
      });

      pandoc.stdin.write(inputText, "utf8");
      pandoc.stdin.end();
    }
  }

  public convertFile(fname: string, callback: PandocCallback): void {
    let outLength = 0;

    if (!fname || typeof fname !== "string") {
      throw "Invalid filename: must be a string.";
    }

    if (typeof callback !== "function") {
      if (callback) {
        throw "Invalid callback provided: must be a function.";
      } else {
        throw "No callback provided: must be a function.";
      }
    }

    for (const type of this.outputTypes) {
      const args: string[] = [];
      args.push("-f", this.inputType, "-t", type.name, fname);
      if (type.fname) {
        args.push("-o", type.fname);
      }
      var pandoc = spawn("pandoc", args);
      (pandoc.stdout as any).targetType = type;

      pandoc.stdout.on("data", (data: Buffer) => {
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
        } else if (outLength === this.outLength) {
          callback(this.manageOut(this.data), null);
        }
      });
    }
  }

  public convertAsync(inputText: string): Promise<PandocData> {
    return new Promise<PandocData>((resolve, reject) => {
      this.convert(inputText, (data, err) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  public convertFileAsync(fname: string): Promise<PandocData> {
    return new Promise<PandocData>((resolve, reject) => {
      this.convertFile(fname, (data, err) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  private manageOut(
    data: { [k: string]: Buffer },
    enc?: BufferEncoding | undefined
  ): { [k: string]: string | Buffer } {
    const _d: { [k: string]: string | Buffer } = {};
    for (const _t of this.outputTypes) {
      if (_t.fname) {
        _d[_t.name] = _t.fname;
      } else {
        if (_t.outBin === true) {
          _d[_t.name] = data[_t.name];
        } else {
          _d[_t.name] = data[_t.name].toString(_t.enc || "utf-8");
        }
      }
    }
    return _d;
  }
}
