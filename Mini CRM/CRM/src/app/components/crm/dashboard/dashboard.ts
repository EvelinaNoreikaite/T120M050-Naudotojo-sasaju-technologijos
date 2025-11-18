import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
    totalCompanies: number = 0;
    totalContacts: number = 0;
    isUsingFirebase: boolean = false;
    
    private readonly COMPANIES_KEY = 'minicrm_companies';
    private readonly CONTACTS_KEY = 'minicrm_contacts';
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    async ngOnInit() {
        if (this.isBrowser) {
            await this.updateStats();
        }
    }

    async updateStats() {
        if (!this.isBrowser) return;
        
        const companiesData = localStorage.getItem(this.COMPANIES_KEY);
        const contactsData = localStorage.getItem(this.CONTACTS_KEY);
        
        this.totalCompanies = companiesData ? JSON.parse(companiesData).length : 0;
        this.totalContacts = contactsData ? JSON.parse(contactsData).length : 0;
    }
}