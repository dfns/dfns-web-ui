import { Eip1193Provider } from 'ethers';

export class DfnsProvider implements Eip1193Provider {
    request(request: { method: string; params?: any[] | Record<string, any> | undefined; }): Promise<any> {
        throw new Error("Method not implemented.");
    }

}