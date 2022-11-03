import { Router } from "medusa-extender";
import createUserHandler from "@medusajs/medusa/dist/api/routes/admin/users/create-user";
import wrapHandler from "@medusajs/medusa/dist/api/middlewares/await-middleware";

// Use this only if you want to allow any user to create their own store
@Router({
  routes: [
    {
      requiredAuth: false,
      path: "/admin/create-user",
      method: "post",
      handlers: [wrapHandler(createUserHandler)],
    },
  ],
})
export class UserRouter {}
