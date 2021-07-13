import { PandocOutFormat } from "./input-format";
import { PandocCallback, PandocData } from "./types";
export declare class Pandoc {
    private data;
    private inputType;
    private outputTypes;
    private outLength;
    constructor(inputMarkup: string, outputMarkups: PandocOutFormat | PandocOutFormat[]);
    convert(inputText: string, callback: PandocCallback): void;
    convertFile(fname: string, callback: PandocCallback): void;
    convertAsync(inputText: string): Promise<PandocData>;
    convertFileAsync(fname: string): Promise<PandocData>;
    private manageOut;
}
