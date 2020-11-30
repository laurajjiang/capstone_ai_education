import { ISessionContext } from '@jupyterlab/apputils';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ServiceManager } from '@jupyterlab/services';
import { Message } from '@lumino/messaging';
import { StackedPanel } from '@lumino/widgets';
/**
 * A panel with the ability to add other children.
 */
export declare class ExamplePanel extends StackedPanel {
    constructor(manager: ServiceManager.IManager, rendermime: IRenderMimeRegistry);
    get session(): ISessionContext;
    dispose(): void;
    execute(code: string): void;
    protected onCloseRequest(msg: Message): void;
    private _sessionContext;
    private _outputarea;
    private _outputareamodel;
}
