import { Request, Response, NextFunction } from "express";
import { JWT_SECRET, UserPayload } from "./generateToken";
import jwt from "jsonwebtoken";

// verificar se o usuário tem o Authorization no header
// verificar se o token é válido
export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token e invalido" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ err: err });
  }

  next();
}

// verificar se o usuário tem permissão para acessar a rota
export function permissionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const path = req.path.replace("/", "");
  const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
  // converter este token para UserPayload
  const payload = jwt.decode(token) as UserPayload;

  if (!payload.permissions.includes(path)) {
    return res
      .status(403)
      .json({ message: "Você não tem permissao para acessar essa rota" });
  }
  next();
}
