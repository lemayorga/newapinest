import { compare, genSalt, hash } from "bcrypt";

/**
 * Encryot text
 * @param text  Text to encrypt 
 * @param roundsSald  Round generate 
 * @returns text encrypted
 */
export const encryptText =  async (text: string, roundsSald: number = 10): Promise<string> => {
    const salt = await genSalt(roundsSald);
    return await hash(text, salt);
}

/**
 * Compare encrypt text vs text
 * @param textCompare Text to compare
 * @param encrypText text encrupt
 * @returns Return true if both encrypt text are same
 */
export const compareEncryptText =  async (textCompare: string, encrypText: string): Promise<boolean> => 
      await compare(textCompare, encrypText);

/**
 * Generte a random integer number
 * @param min Minimum number (optional)
 * @param max Maximum number (optional)
 * @returns random number integer
 */
export const randomInteger = (min: number = 0, max: number = Number.MAX_VALUE): number => 
    Math.floor(min + Math.random()*(max - min + 1));
