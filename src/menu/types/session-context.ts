import { Context } from 'telegraf';

interface PromptData {
    nodeId: string;
    messageId: number;
    params: any;
}

interface SessionData {
    prompt?: PromptData;
}

export interface SessionContext extends Context {
    session: SessionData;
}
