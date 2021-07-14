/// <reference types="node" />
export interface PandocOutFormat {
    name: string;
    format: string;
    outBin?: boolean;
    enc?: BufferEncoding;
    fname?: string;
}
