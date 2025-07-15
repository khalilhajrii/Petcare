export interface Pet {
  idPet: number;
  nom: string;
  type: string;
  age: number;
  race: string;
  userId: number;
  user?: any;
  vaccinationRecords?: any[];
  reservations?: any[];
}

export enum PetRace {
  // Races de chiens
  LABRADOR = 'Labrador',
  BERGER_ALLEMAND = 'Berger Allemand',
  GOLDEN_RETRIEVER = 'Golden Retriever',
  BULLDOG = 'Bulldog',
  BEAGLE = 'Beagle',
  CANICHE = 'Caniche',
  HUSKY = 'Husky',
  CHIHUAHUA = 'Chihuahua',
  
  // Races de chats
  SIAMOIS = 'Siamois',
  PERSAN = 'Persan',
  MAINE_COON = 'Maine Coon',
  BENGAL = 'Bengal',
  SPHYNX = 'Sphynx',
  RAGDOLL = 'Ragdoll',
  BRITISH_SHORTHAIR = 'British Shorthair',
  ABYSSIN = 'Abyssin',
  
  // Autres animaux
  AUTRE = 'Autre'
}

export enum PetType {
  CHIEN = 'Chien',
  CHAT = 'Chat',
  OISEAU = 'Oiseau',
  POISSON = 'Poisson',
  REPTILE = 'Reptile',
  RONGEUR = 'Rongeur',
  AUTRE = 'Autre'
}