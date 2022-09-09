import * as bcrypt from "bcrypt";

const passwordHashing = {
    hashUserPassword: async (password: string): Promise<string> => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            throw new Error(error);
        }
    },

    unhashPassword: async (userPassword: string, dbHashPassword): Promise<boolean> => {
        const isPasswordCorrect = await bcrypt.compare(userPassword, dbHashPassword);
        return isPasswordCorrect;
    }
}

export default passwordHashing;

