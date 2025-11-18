export class Contact {
    public id?: string;
    public companyId: string = '';        // ← Links to company
    public vardas: string = '';           // ← First name
    public pavarde: string = '';          // ← Last name
    public pareigos: string = '';         // ← Position
    public telefonas: string = '';        // ← Phone
    public registracijosLaikas?: string;

    constructor(data?: Partial<Contact>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    get pilnasVardas(): string {          // ← Full name getter
        return `${this.vardas} ${this.pavarde}`.trim();
    }
}