import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "7d";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, hashed: string) =>
    bcrypt.compare(password, hashed);

export const generateAccessToken = (payload: object) =>
    jwt.sign(payload, ACCESS_SECRET as jwt.Secret, { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions);

export const generateRegToken = (payload: object) =>
    jwt.sign(payload, process.env.REG_JWT_SECRET as jwt.Secret, { expiresIn: '15m' } as jwt.SignOptions);
export const verifyRegToken = (token: string) =>
    jwt.verify(token, process.env.REG_JWT_SECRET as jwt.Secret);
export const generateRefreshToken = (payload: object) =>
    jwt.sign(payload, REFRESH_SECRET as jwt.Secret, { expiresIn: REFRESH_EXPIRES } as jwt.SignOptions);

export const verifyAccessToken = (token: string) =>
    jwt.verify(token, ACCESS_SECRET as jwt.Secret);

export const verifyRefreshToken = (token: string) =>
    jwt.verify(token, REFRESH_SECRET as jwt.Secret);
