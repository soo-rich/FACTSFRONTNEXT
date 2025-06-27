import { z } from "zod";

export type UtilisateurDto = {
  id: string;
  nom: string;
  prenom: string;
  telephone: number;
  email: string;
  username: string;
  role: string;
  dateCreation: Date;
  actif: boolean;
};

export const userCreateSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis" }),
  prenom: z.string().min(1, { message: "Le prénom est requis" }),
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" }),
  numero: z
    .string()
    .min(1, { message: "Le numéro est requis" })
    .regex(/^[0-9]*$/, {
      message: "Le numéro doit contenir uniquement des chiffres",
    }),
  username: z
    .string()
    .min(4, {
      message: "Le nom d'utilisateur doit contenir au moins 4 caractères",
    })
    .max(9, {
      message: "Le nom d'utilisateur doit contenir au maximum 9 caractères",
    }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const userUpdateSchema = z.object({
  id: z.string().min(1, { message: "L'id est requis" }),
  nom: z.string().min(1, { message: "Le nom est requis" }),
  prenom: z.string().min(1, { message: "Le prénom est requis" }),
  email: z.string().min(1, { message: "L'email est requis" }),
  numero: z.string().min(1, { message: "Le numéro est requis" }),
});

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Le mot de passe actuel est requis" }),
    newpassword: z
      .string()
      .min(1, { message: "Le nouveau mot de passe est requis" }),
    confirmpassword: z
      .string()
      .min(1, { message: "La confirmation du mot de passe est requise" }),
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmpassword"],
  });

export type UtilisateurUpdate = z.infer<typeof userUpdateSchema>;

export type Register = z.infer<typeof userCreateSchema>;

export type ChangePassword = z.infer<typeof changePasswordSchema>;
