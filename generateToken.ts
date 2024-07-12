import jwt from "jsonwebtoken";

export interface UserPayload {
  userId: string;
  name: string;
  permissions: string[];
}

export const JWT_SECRET = "testedefrasemuitomassa"; // deve vir de um variável de ambiente

export function generateToken(payload: UserPayload): string {
  const EXPRIRES_ONE_HOUR = 60 * 60;

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPRIRES_ONE_HOUR,
  });
}
