import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10y' });
        return token;

    } catch (error) {
        console.log(`Generating Token Error : ${error}`);
        return null;
    }
}