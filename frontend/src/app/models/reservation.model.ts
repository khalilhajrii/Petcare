export enum ReservationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Reservation {
  idreserv: number;
  date: string;
  time: string;
  lieu: string;
  status: ReservationStatus;
  petId: number;
  userId: number;
  pet?: {
    idPet: number;
    nom: string;
    type: string;
    race: string;
    age: number;
  };
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  services?: {
    idservice: number;
    nom: string;
    description: string;
    prix: number;
  }[];
}