/// <reference types="node" />
export declare type PandocData = {
    [format: string]: string | Buffer;
} | null;
export declare type PandocCallback = (data: PandocData, err: Error | null) => void;
