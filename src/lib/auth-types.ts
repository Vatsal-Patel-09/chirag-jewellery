import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role: "customer" | "admin";
  }
}

// JWT type extension handled via auth.ts callbacks
