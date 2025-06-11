/* Structure de l'objet user */
export interface User {
  id: number;
  email: string;
  name: string;
  token?: string;
}