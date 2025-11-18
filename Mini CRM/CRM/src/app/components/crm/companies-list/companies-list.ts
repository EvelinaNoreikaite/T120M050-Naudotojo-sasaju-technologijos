import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Company } from '../../../models/company';

@Component({
    selector: 'app-companies-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './companies-list.html',
    styleUrl: './companies-list.css'
})
export class CompaniesList implements OnInit {
    companies: Company[] = [];
    private readonly COMPANIES_KEY = 'minicrm_companies';
    private readonly CONTACTS_KEY = 'minicrm_contacts';

    constructor() {}

    async ngOnInit() {
        await this.loadCompanies();
    }

    async loadCompanies() {
        const data = localStorage.getItem(this.COMPANIES_KEY);
        this.companies = data ? JSON.parse(data).map((c: any) => new Company(c)) : [];
    }

    async deleteCompany(id: string | undefined) {
        if (!id) return;
        
        if (confirm('Ar tikrai norite ištrinti šią įmonę?')) {
            // Delete company
            let companies = this.companies.filter(c => c.id !== id);
            localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(companies));
            
            // Delete related contacts
            const contactsData = localStorage.getItem(this.CONTACTS_KEY);
            if (contactsData) {
                let contacts = JSON.parse(contactsData);
                contacts = contacts.filter((c: any) => c.companyId !== id);
                localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
            }
            
            await this.loadCompanies();
        }
    }

    viewCompany(company: Company) {
        console.clear();
        console.log('%c╔═══════════════════════════════════════════════╗', 'color: #3c8dbc; font-weight: bold');
        console.log('%c        ĮMONĖS DUOMENYS', 'color: #00a65a; font-size: 16px; font-weight: bold');
        console.log('%c╠═══════════════════════════════════════════════╣', 'color: #3c8dbc; font-weight: bold');
        console.table(company);
        console.log('%c╚═══════════════════════════════════════════════╝', 'color: #3c8dbc; font-weight: bold');
    }
}