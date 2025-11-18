import { Routes } from '@angular/router';
import { Dashboard } from './components/crm/dashboard/dashboard';
import { CompaniesList } from './components/crm/companies-list/companies-list';
import { CompanyForm } from './components/crm/company-form/company-form';
import { ContactsList } from './components/crm/contacts-list/contacts-list';
import { NewItem } from './components/items/new-item/new-item';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'companies', component: CompaniesList },
    { path: 'companies/create', component: CompanyForm },
    { path: 'companies/edit/:id', component: CompanyForm },
    { path: 'contacts', component: ContactsList },
    { path: 'items/new', component: NewItem }
];