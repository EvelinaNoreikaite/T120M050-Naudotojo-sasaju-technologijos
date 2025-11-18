import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company } from '../../../models/company';
import { Contact } from '../../../models/contact';

@Component({
    selector: 'app-company-form',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
    templateUrl: './company-form.html',
    styleUrl: './company-form.css'
})
export class CompanyForm implements OnInit {
    companyForm: FormGroup;
    showSuccessAlert: boolean = false;
    showErrorAlert: boolean = false;
    isEditMode: boolean = false;
    companyId: string | null = null;
    
    private readonly COMPANIES_KEY = 'minicrm_companies';
    private readonly CONTACTS_KEY = 'minicrm_contacts';

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.companyForm = new FormGroup({
            // Company fields
            companyName: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
            ]),
            companyCode: new FormControl('', [
                Validators.pattern(/^\d*$/)
            ]),
            vatCode: new FormControl('', [
                Validators.pattern(/^(LT)?\d*$/)
            ]),
            address: new FormControl(''),
            email: new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            phone: new FormControl('', [
                Validators.minLength(10),
                Validators.maxLength(12),
                Validators.pattern(/^\+?\d*$/)
            ]),
            // Contact fields
            firstName: new FormControl(''),
            lastName: new FormControl(''),
            position: new FormControl(''),
            contactPhone: new FormControl('', [
                Validators.minLength(10),
                Validators.maxLength(12),
                Validators.pattern(/^\+?\d*$/)
            ])
        });
    }

    async ngOnInit() {
        this.companyId = this.route.snapshot.paramMap.get('id');
        if (this.companyId) {
            this.isEditMode = true;
            await this.loadCompany(this.companyId);
        }
    }

    async loadCompany(id: string) {
        const companies = this.getCompanies();
        const company = companies.find(c => c.id === id);
        
        if (company) {
            this.companyForm.patchValue({
                companyName: company.pavadinimas,
                companyCode: company.kodas,
                vatCode: company.pvmKodas,
                address: company.adresas,
                email: company.elPastas,
                phone: company.telefonas
            });

            // Load contact if exists
            const contacts = this.getContacts();
            const companyContacts = contacts.filter(c => c.companyId === id);
            if (companyContacts.length > 0) {
                const contact = companyContacts[0];
                this.companyForm.patchValue({
                    firstName: contact.vardas,
                    lastName: contact.pavarde,
                    position: contact.pareigos,
                    contactPhone: contact.telefonas
                });
            }
        }
    }

    getCompanies(): Company[] {
        const data = localStorage.getItem(this.COMPANIES_KEY);
        return data ? JSON.parse(data).map((c: any) => new Company(c)) : [];
    }

    getContacts(): Contact[] {
        const data = localStorage.getItem(this.CONTACTS_KEY);
        return data ? JSON.parse(data).map((c: any) => new Contact(c)) : [];
    }

    async submitForm() {
        this.showSuccessAlert = false;
        this.showErrorAlert = false;

        if (this.companyForm.valid) {
            const formValue = this.companyForm.value;

            // Create/Update company
            const companyData = new Company({
                id: this.companyId || Date.now().toString(),
                pavadinimas: formValue.companyName,
                kodas: formValue.companyCode,
                pvmKodas: formValue.vatCode,
                adresas: formValue.address,
                elPastas: formValue.email,
                telefonas: formValue.phone,
                registracijosLaikas: new Date().toISOString()
            });

            // Save company
            const companies = this.getCompanies();
            const existingIndex = companies.findIndex(c => c.id === companyData.id);
            if (existingIndex >= 0) {
                companies[existingIndex] = companyData;
            } else {
                companies.push(companyData);
            }
            localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(companies));

            // Create/Update contact if fields are filled
            if (formValue.firstName || formValue.lastName) {
                const contactData = new Contact({
                    id: Date.now().toString() + Math.random(),
                    companyId: companyData.id!,
                    vardas: formValue.firstName,
                    pavarde: formValue.lastName,
                    pareigos: formValue.position,
                    telefonas: formValue.contactPhone,
                    registracijosLaikas: new Date().toISOString()
                });
                
                const contacts = this.getContacts();
                contacts.push(contactData);
                localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
            }

            // Console output
            console.clear();
            console.log('%c╔═══════════════════════════════════════════════╗', 'color: #3c8dbc; font-weight: bold');
            console.log('%c    ĮMONĖ IR KONTAKTAS UŽREGISTRUOTI', 'color: #00a65a; font-size: 16px; font-weight: bold');
            console.log('%c╠═══════════════════════════════════════════════╣', 'color: #3c8dbc; font-weight: bold');
            console.log('%c📊 ĮMONĖS DUOMENYS:', 'color: #3c8dbc; font-size: 14px; font-weight: bold');
            console.table(companyData);
            
            if (formValue.firstName || formValue.lastName) {
                console.log('%c👤 KONTAKTINIS ASMUO:', 'color: #3c8dbc; font-size: 14px; font-weight: bold');
                console.table({
                    vardas: formValue.firstName || '-',
                    pavarde: formValue.lastName || '-',
                    pareigos: formValue.position || '-',
                    telefonas: formValue.contactPhone || '-'
                });
            }
            console.log('%c╚═══════════════════════════════════════════════╝', 'color: #3c8dbc; font-weight: bold');

            // Show success and redirect
            this.showSuccessAlert = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                this.showSuccessAlert = false;
                this.router.navigate(['/companies']);
            }, 1500);
        } else {
            this.showErrorAlert = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.markFormGroupTouched(this.companyForm);
        }
    }

    resetForm() {
        this.companyForm.reset();
        this.showSuccessAlert = false;
        this.showErrorAlert = false;
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.companyForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.companyForm.get(fieldName);
        if (!field || !field.errors) return '';

        if (field.errors['required']) return 'Šis laukas yra privalomas';
        if (field.errors['minlength']) return `Minimalus ilgis: ${field.errors['minlength'].requiredLength} simboliai`;
        if (field.errors['maxlength']) return `Maksimalus ilgis: ${field.errors['maxlength'].requiredLength} simbolių`;
        if (field.errors['email']) return 'Neteisingas el. pašto formato';
        if (field.errors['pattern']) {
            if (fieldName === 'companyCode') return 'Įmonės kodas gali turėti tik skaičius';
            if (fieldName === 'vatCode') return 'PVM kodas turi būti skaičiai arba LT[skaičiai]';
            if (fieldName === 'phone' || fieldName === 'contactPhone') return 'Telefono numeris gali turėti tik skaičius ir + pradžioje';
        }
        
        return 'Neteisingas laukas';
    }
}