export interface IKMSService {
    encryptMessage(message: any): Promise<string>;
    decryptMessage(message: string): Promise<string>;
}