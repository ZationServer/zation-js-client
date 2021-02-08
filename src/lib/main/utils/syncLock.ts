/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

interface Process<T = any> {
    priority: number,
    task: () => Promise<T> | T,
    resolve: (value: T) => void,
    reject: (err: any) => void
}

// noinspection JSIgnoredPromiseFromCall
export default class SyncLock {

    private scheduleProcesses: Process[] = [];
    private running: boolean = false;

    schedule<T>(task: () => Promise<T> | T, priority: number = 0): Promise<T> {

        const process: Partial<Process> = {priority, task};
        const promise: Promise<T> = new Promise((resolve, reject) => {
            process.resolve = resolve;
            process.reject = reject;
        })

        if(this.scheduleProcesses.length <= 0) this.scheduleProcesses.push(process as Process)
        else {
            let inserted = false;
            for(let i = 0; i < this.scheduleProcesses.length; i++) {
                if(this.scheduleProcesses[i].priority < priority) {
                    this.scheduleProcesses.splice(i, 0, process as Process);
                    inserted = true;
                    break;
                }
            }
            if(!inserted) this.scheduleProcesses.push(process as Process)
        }

        if(!this.running) this.run()
        return promise;
    }

    private async run(){
        this.running = true;

        const process = this.scheduleProcesses.shift();
        if(!process) {
            this.running = false;
            return;
        }

        try {process.resolve(await process.task());}
        catch (err) {process.reject(err)}

        await this.run();
    }
}