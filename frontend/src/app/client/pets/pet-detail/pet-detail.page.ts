import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../client.service';
import { VaccinationService } from '../../vaccination.service';
import { ToastController, LoadingController, IonicModule } from '@ionic/angular';
import { Pet, PetType, PetRace } from '../../../models/pet.model';
import { VaccinationRecord } from '../../../models/vaccination-record.model';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  styleUrls: ['./pet-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule]
})
export class PetDetailPage implements OnInit {
  petForm: FormGroup;
  petId: number = 0;
  isNewPet = false;
  petTypes = Object.values(PetType);
  petRaces = Object.values(PetRace);
  selectedType: string = '';
  filteredRaces: string[] = [];
  vaccinationRecords: VaccinationRecord[] = [];
  loadingVaccinations = false;
  vaccinationError = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private vaccinationService: VaccinationService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.petForm = this.formBuilder.group({
      nom: ['', Validators.required],
      type: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      race: ['', Validators.required],
      vaccinations: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNewPet = id === 'new';
    console.log('Is new pet:', this.isNewPet, 'ID:', id);
    
    if (!this.isNewPet && id) {
      this.petId = +id;
      this.loadPet();
    }
    
    // Ensure form is reset when adding a new pet
    if (this.isNewPet) {
      this.petForm.reset();
      // Set petId to 0 to ensure we're creating a new pet
      this.petId = 0;
      console.log('Reset form for new pet, petId set to:', this.petId);
    }

    // Listen for type changes to filter races
    this.petForm.get('type')?.valueChanges.subscribe(type => {
      this.selectedType = type;
      this.filterRacesByType(type);
      // Reset race when type changes
      this.petForm.get('race')?.setValue('');
    });
  }

  filterRacesByType(type: string) {
    // Filter races based on the selected type
    if (type === PetType.CHIEN) {
      this.filteredRaces = Object.values(PetRace).filter(race => 
        [PetRace.LABRADOR, PetRace.BERGER_ALLEMAND, PetRace.GOLDEN_RETRIEVER, 
         PetRace.BULLDOG, PetRace.BEAGLE, PetRace.CANICHE, PetRace.HUSKY, 
         PetRace.CHIHUAHUA, PetRace.AUTRE].includes(race as PetRace)
      );
    } else if (type === PetType.CHAT) {
      this.filteredRaces = Object.values(PetRace).filter(race => 
        [PetRace.SIAMOIS, PetRace.PERSAN, PetRace.MAINE_COON, PetRace.BENGAL, 
         PetRace.SPHYNX, PetRace.RAGDOLL, PetRace.BRITISH_SHORTHAIR, 
         PetRace.ABYSSIN, PetRace.AUTRE].includes(race as PetRace)
      );
    } else {
      this.filteredRaces = [PetRace.AUTRE];
    }
  }

  async loadPet() {
    const loading = await this.loadingController.create({
      message: 'Chargement des informations...'
    });
    await loading.present();

    this.clientService.getPet(this.petId).subscribe({
      next: (pet) => {
        this.petForm.patchValue({
          nom: pet.nom,
          type: pet.type,
          age: pet.age,
          race: pet.race
        });
        this.selectedType = pet.type;
        this.filterRacesByType(pet.type);
        loading.dismiss();
        
        // Load vaccination records for this pet
        this.loadVaccinationRecords(this.petId);
      },
      error: (error) => {
        console.error('Error loading pet', error);
        this.showToast('Erreur lors du chargement des informations de l\'animal');
        loading.dismiss();
        this.router.navigate(['/client/pets']);
      }
    });
  }
  
  loadVaccinationRecords(petId: number) {
    this.loadingVaccinations = true;
    this.vaccinationError = false;
    
    this.vaccinationService.getVaccinationRecordsByPet(petId)
      .pipe(
        catchError(error => {
          console.error('Error loading vaccination records', error);
          this.vaccinationError = true;
          return of([]);
        }),
        finalize(() => {
          this.loadingVaccinations = false;
        })
      )
      .subscribe(records => {
        this.vaccinationRecords = records;
      });
  }
  
  get vaccinationsArray() {
    return this.petForm.get('vaccinations') as FormArray;
  }

  addVaccination() {
    const vaccinationGroup = this.formBuilder.group({
      nomVaccin: ['', Validators.required],
      dateVaccination: ['', Validators.required],
      veterinaire: ['', Validators.required]
    });
    
    this.vaccinationsArray.push(vaccinationGroup);
  }

  removeVaccination(index: number) {
    this.vaccinationsArray.removeAt(index);
  }

  async savePet() {
    if (this.petForm.invalid) {
      this.showToast('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isNewPet ? 'Ajout en cours...' : 'Mise à jour en cours...'
    });
    await loading.present();

    // Get userId from localStorage, default to '0' if not found
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      this.showToast('Erreur: Utilisateur non identifié. Veuillez vous reconnecter.');
      loading.dismiss();
      this.router.navigate(['/login']);
      return;
    }
    
    // Remove vaccinations from petData as they are handled separately
    const { vaccinations, ...petFormValue } = this.petForm.value;
    
    const petData: Partial<Pet> = {
      ...petFormValue,
      userId: +userId
    };

    console.log('Saving pet with data:', petData);
    console.log('Is new pet:', this.isNewPet);
    console.log('Pet ID:', this.petId);
    console.log('Current route:', this.router.url);

    // IMPORTANT: Force isNewPet to true if we're on the 'new' route
    if (this.router.url.includes('/pets/new')) {
      this.isNewPet = true;
      console.log('Forced isNewPet to true based on URL');
    }

    // Ensure we're using the correct method based on isNewPet flag
    if (this.isNewPet) {
      // For new pets, use POST to /pets
      console.log('Creating new pet with POST method');
      this.clientService.createPet(petData).subscribe({
        next: (createdPet) => {
          console.log('Pet created successfully:', createdPet);
          
          // Save vaccination records if any
          if (this.vaccinationsArray.length > 0) {
            this.saveVaccinationRecords(createdPet.idPet, loading);
          } else {
            this.showToast('Animal ajouté avec succès');
            loading.dismiss();
            // Navigate back to pets list after successful creation
            this.router.navigate(['/client/pets']);
          }
        },
        error: (error) => {
          console.error('Error creating pet', error);
          this.showToast('Erreur lors de l\'ajout de l\'animal');
          loading.dismiss();
        }
      });
    } else {
      // For existing pets, use PUT to /pets/:id
      console.log('Updating existing pet with PUT method to /pets/' + this.petId);
      this.clientService.updatePet(this.petId, petData).subscribe({
        next: (updatedPet) => {
          console.log('Pet updated successfully:', updatedPet);
          
          // Save vaccination records if any
          if (this.vaccinationsArray.length > 0) {
            this.saveVaccinationRecords(updatedPet.idPet, loading);
          } else {
            this.showToast('Animal mis à jour avec succès');
            loading.dismiss();
            this.router.navigate(['/client/pets']);
          }
        },
        error: (error) => {
          console.error('Error updating pet', error);
          this.showToast('Erreur lors de la mise à jour de l\'animal');
          loading.dismiss();
        }
      });
    }
  }
  
  saveVaccinationRecords(petId: number, loading: HTMLIonLoadingElement) {
    const vaccinationObservables = this.vaccinationsArray.controls.map(control => {
      const vaccinationData = {
        ...control.value,
        petId: petId
      };
      return this.vaccinationService.createVaccinationRecord(vaccinationData);
    });
    
    if (vaccinationObservables.length === 0) {
      this.showToast('Animal enregistré avec succès');
      loading.dismiss();
      this.router.navigate(['/client/pets']);
      return;
    }
    
    forkJoin(vaccinationObservables).subscribe({
      next: (results) => {
        console.log('Vaccination records saved:', results);
        this.showToast('Animal et vaccinations enregistrés avec succès');
        loading.dismiss();
        this.router.navigate(['/client/pets']);
      },
      error: (error) => {
        console.error('Error saving vaccination records', error);
        this.showToast('Animal enregistré mais erreur lors de l\'ajout des vaccinations');
        loading.dismiss();
        this.router.navigate(['/client/pets']);
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}