import Adapters from "next-auth/adapters";

// Extend the built-in models using class inheritance
export default class User extends (<any>Adapters.TypeORM.Models.User.model) {
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(
    name: string,
    email: string,
    image: string,
    emailVerified: Date | undefined
  ) {
    super(name, email, image, emailVerified);
    this.roles = [];
  }

  public roles: string[];
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    roles: {
      type: "object",
      default: [] as string[],
    },
  },
};
