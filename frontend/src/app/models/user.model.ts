export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  isActive: boolean;
  disponibilite: boolean;
  roleId: number;
  role?: {
    id: number;
    roleName: string;
  };
}