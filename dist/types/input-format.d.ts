/// <reference types="node" />
export interface PandocOutFormat {
    name: string;
    outBin?: boolean;
    enc?: BufferEncoding;
    fname?: string;
}