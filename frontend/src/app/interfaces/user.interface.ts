export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'prestataire';
  phone?: string;
  address?: string;
}