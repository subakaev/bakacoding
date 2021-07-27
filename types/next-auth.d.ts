import { Session } from "next-auth";

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
    roles: string[];
  }

  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      roles: string[];
    };
  }
}
