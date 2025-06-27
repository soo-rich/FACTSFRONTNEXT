// src/types/next-auth.d.ts

declare module "next-auth" {
  type Session = {
    bearer?: string;
    refresh?: string;
    error?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
      nom?: string;
      prenom?: string;
      numero?: string;
      role?: string;
    };
  };
}
