/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export default interface TokenStore {
    /**
     * The function that is called to save the signed token
     * @param signedToken
     */
    saveToken(signedToken: string): Promise<void> | void;

    /**
     * The function that loads the signed token.
     * If no signed token is stored you can return null.
     */
    loadToken(): Promise<string | null> | string | null

    /**
     * The function that is called to remove the signed token.
     */
    removeToken(): Promise<void> | void
}