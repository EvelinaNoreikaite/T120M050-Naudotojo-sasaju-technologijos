import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../models/contact';
import { Company } from '../../../models/company';

interface ContactWithCompany {
    id?: string;
    companyId: string;
    vardas: string;
    pavarde: string;
    pareigos: string;
    telefonas: string;
    registracijosLaikas?: string;
    pilnasVardas: string;
    companyName?: string;
}

@Component({
    selector: 'app-contacts-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './contacts-list.html',
    styleUrl: './contacts-list.css'
})
export class ContactsList implements OnInit {
    contacts: ContactWithCompany[] = [];
    private readonly COMPANIES_KEY = 'minicrm_companies';
    private readonly CONTACTS_KEY = 'minicrm_contacts';

    constructor() {}

    async ngOnInit() {
        await this.loadContacts();
    }

    async loadContacts() {
        const contactsData = localStorage.getItem(this.CONTACTS_KEY);
        const companiesData = localStorage.getItem(this.COMPANIES_KEY);
        
        const contacts: Contact[] = contactsData ? JSON.parse(contactsData).map((c: any) => new Contact(c)) : [];
        const companies: Company[] = companiesData ? JSON.parse(companiesData).map((c: any) => new Company(c)) : [];

        this.contacts = contacts.map((contact: Contact) => {
            const company = companies.find((c: Company) => c.id === contact.companyId);
            return {
                id: contact.id,
                companyId: contact.companyId,
                vardas: contact.vardas,
                pavarde: contact.pavarde,
                pareigos: contact.pareigos,
                telefonas: contact.telefonas,
                registracijosLaikas: contact.registracijosLaikas,
                pilnasVardas: contact.pilnasVardas,
                companyName: company ? company.pavadinimas : 'Nežinoma įmonė'
            };
        });
    }

    async deleteContact(id: string | undefined) {
        if (!id) return;
        
        if (confirm('Ar tikrai norite ištrinti šį kontaktą?')) {
            const contactsData = localStorage.getItem(this.CONTACTS_KEY);
            if (contactsData) {
                let contacts = JSON.parse(contactsData);
                contacts = contacts.filter((c: any) => c.id !== id);
                localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
                await this.loadContacts();
            }
        }
    }

    async viewContact(contact: ContactWithCompany) {
        console.clear();
        console.log('%c╔═══════════════════════════════════════════════╗', 'color: #3c8dbc; font-weight: bold');
        console.log('%c        KONTAKTO DUOMENYS', 'color: #00a65a; font-size: 16px; font-weight: bold');
        console.log('%c╠═══════════════════════════════════════════════╣', 'color: #3c8dbc; font-weight: bold');
        console.table(contact);
        
        if (contact.companyId) {
            const companiesData = localStorage.getItem(this.COMPANIES_KEY);
            if (companiesData) {
                const companies: Company[] = JSON.parse(companiesData).map((c: any) => new Company(c));
                const company = companies.find((c: Company) => c.id === contact.companyId);
                if (company) {
                    console.log('%c\n📊 SUSIETA ĮMONĖ:', 'color: #3c8dbc; font-size: 14px; font-weight: bold');
                    console.table(company);
                }
            }
        }
        console.log('%c╚═══════════════════════════════════════════════╝', 'color: #3c8dbc; font-weight: bold');
    }
}