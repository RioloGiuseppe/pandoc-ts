export type PandocData = { [format: string]: string | Buffer } | null;
export type PandocCallback = (data: PandocData, err: Error | null) => void;
