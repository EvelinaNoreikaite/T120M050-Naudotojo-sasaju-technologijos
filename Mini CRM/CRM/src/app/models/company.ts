export class Company {
    public id?: string;
    public pavadinimas: string = '';
    public kodas: string = '';
    public pvmKodas: string = '';
    public adresas: string = '';
    public elPastas: string = '';
    public telefonas: string = '';
    public registracijosLaikas?: string;

    constructor(data?: Partial<Company>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}