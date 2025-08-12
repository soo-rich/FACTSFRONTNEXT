import type { InferInput } from 'valibot'
import { custom, email, maxLength, minLength, object, pipe, regex, string } from 'valibot'

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

export const userCreateSchema = object({
  nom: pipe(string(), minLength(1, 'Le nom est requis')),
  prenom: pipe(string(), minLength(1, 'Le prénom est requis')),
  email: pipe(
    string(),
    minLength(1, 'L\'email est requis'),
    email('Email invalide')
  ),
  numero: pipe(
    string(),
    minLength(1, 'Le numéro est requis'),
    regex(/^[0-9]*$/, 'Le numéro doit contenir uniquement des chiffres')
  ),
  username: pipe(
    string(),
    minLength(4, 'Le nom d\'utilisateur doit contenir au moins 4 caractères'),
    maxLength(9, 'Le nom d\'utilisateur doit contenir au maximum 9 caractères')
  ),

  // password: pipe(string(), minLength(1, 'Le mot de passe est requis'))
})

export const userUpdateSchema = object({
  id: pipe(string(), minLength(1, 'L\'id est requis')),
  nom: pipe(string(), minLength(1, 'Le nom est requis')),
  prenom: pipe(string(), minLength(1, 'Le prénom est requis')),
  email: pipe(string(), minLength(1, 'L\'email est requis')),
  numero: pipe(string(), minLength(1, 'Le numéro est requis'))
})

export const changePasswordSchema = pipe(
  object({
    password: pipe(string(), minLength(5, 'Le mot de passe actuel est requis')),
    newpassword: pipe(string(), minLength(6, 'Le nouveau mot de passe est requis et doit contenir au moins 6 caractères'), regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/, 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un symbole')),
    confirmpassword: pipe(string(), minLength(6, 'La confirmation du mot de passe est requise'))
  }),
  custom((data) => {
    return (data as any).newpassword === (data as any).confirmpassword

  }, 'Les mots de passe ne correspondent pas')
)

export type UtilisateurUpdate = InferInput<typeof userUpdateSchema>;

export type UtilsateurRegister = InferInput<typeof userCreateSchema>;

export type ChangePassword = InferInput<typeof changePasswordSchema>;
