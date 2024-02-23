import { compare, genSalt, hash } from "bcrypt";

export const encryptText =  async (password: string, roundsSald: number = 10): Promise<string> => {
    const salt = await genSalt(roundsSald);
    return await hash(password, salt);
}

export const compareEncryptText =  async (textCompare: string, encrypText: string): Promise<boolean> => {
    return  await compare(textCompare, encrypText);
}