import { Catalogue, Company } from "src/database/models/commun";

export const PROVIDER_NAMES = {
    COMMUN_CATALOGUE:  'COMMUN_CATALOGUE',
    COMMUN_COMPANY: 'COMMUN_COMPANY',
}


export const CommunProviders = [
    {
        provide: PROVIDER_NAMES.COMMUN_CATALOGUE,
        useValue: Catalogue,
    },
    {
        provide: PROVIDER_NAMES.COMMUN_COMPANY,
        useValue: Company,
    },
];