import express from "express";
import { getUser } from "./service";
import { generateToken, UserPayload } from "./generateToken";
import { AuthMiddleware, permissionMiddleware } from "./middleware";

enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
}

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // verificar se o usuário existe
  const user = getUser(username, password);
  console.log(user);

  if (!user) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Usuário não encontrado" });
  }

  if (user.permissions?.length === undefined) {
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ permission: "Permissão não encontrada" });
  }

  const permissions = user.permissions.map((permission) => permission.path);

  const payloads: UserPayload = {
    userId: user.id.toString(),
    name: user.name,
    permissions: permissions,
  };

  const token = generateToken(payloads);
  return res
    .status(HttpStatusCode.OK)
    .json({ message: "Usuário Logado", token: token });
});

app.get("/contracts", AuthMiddleware, permissionMiddleware, (req, res) =>
  res.json({ lista: "Lista de contratos" }),
);
app.get("/customers", AuthMiddleware, permissionMiddleware, (req, res) =>
  res.json({ lista: "Lista de clientes" }),
);
app.get("/invoices", AuthMiddleware, permissionMiddleware, (req, res) =>
  res.json({ lista: "Lista de faturas" }),
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
