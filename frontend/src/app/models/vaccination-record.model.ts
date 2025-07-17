export interface VaccinationRecord {
  id: number;
  nomVaccin: string;
  dateVaccination: Date;
  veterinaire: string;
  petId: number;
  pet?: any;
}