import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { Contact } from '../models/contact';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly COMPANIES_KEY = 'minicrm_companies';
    private readonly CONTACTS_KEY = 'minicrm_contacts';

    constructor() {}

    // Company methods
    getCompanies(): Company[] {
        const data = localStorage.getItem(this.COMPANIES_KEY);
        return data ? JSON.parse(data).map((c: any) => new Company(c)) : [];
    }

    getCompanyById(id: string): Company | null {
        const companies = this.getCompanies();
        return companies.find(c => c.id === id) || null;
    }

    saveCompany(company: Company): string {
        const companies = this.getCompanies();
        company.registracijosLaikas = new Date().toISOString();
        
        if (!company.id) {
            company.id = Date.now().toString();
        }

        const existingIndex = companies.findIndex(c => c.id === company.id);
        if (existingIndex >= 0) {
            companies[existingIndex] = company;
        } else {
            companies.push(company);
        }
        
        localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(companies));
        console.log('✅ Company saved to localStorage');
        return company.id;
    }

    deleteCompany(id: string): void {
        let companies = this.getCompanies();
        companies = companies.filter(c => c.id !== id);
        localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(companies));

        // Delete related contacts
        let contacts = this.getContacts();
        contacts = contacts.filter(c => c.companyId !== id);
        localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
    }

    // Contact methods
    getContacts(): Contact[] {
        const data = localStorage.getItem(this.CONTACTS_KEY);
        return data ? JSON.parse(data).map((c: any) => new Contact(c)) : [];
    }

    getContactsByCompany(companyId: string): Contact[] {
        const contacts = this.getContacts();
        return contacts.filter(c => c.companyId === companyId);
    }

    saveContact(contact: Contact): string {
        const contacts = this.getContacts();
        contact.registracijosLaikas = new Date().toISOString();
        
        if (!contact.id) {
            contact.id = Date.now().toString() + Math.random();
        }
        
        contacts.push(contact);
        localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
        console.log('✅ Contact saved to localStorage');
        return contact.id;
    }

    deleteContact(id: string): void {
        let contacts = this.getContacts();
        contacts = contacts.filter(c => c.id !== id);
        localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
    }
}