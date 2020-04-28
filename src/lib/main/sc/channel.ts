export interface Channel
{
    name: string;
    state: string;
    waitForAuth: boolean;
    batch: boolean;

    SUBSCRIBED: string;
    PENDING: string;
    UNSUBSCRIBED: string;

    getState(): string;
    subscribe(options?: object): void;
    unsubscribe(): void;
    isSubscribed(includePending?: boolean): boolean;
    publish(data: any, callback?: Function): void;
    watch(handler: Function): void;
    unwatch(handler?: Function): void;
    watchers(): Function[];
    destroy(): void;

    on(event: string, handler: Function): void;
    once(event: string, handler: Function): void;
    off(event?: string, handler?: Function): void;
}