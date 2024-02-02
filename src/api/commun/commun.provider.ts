import { PROVIDERS_NAMES } from 'src/core';
import { Catalogue, Company } from "src/database/models/commun";

export const CommunProviders = [
    {
        provide: PROVIDERS_NAMES.COMMUN_CATALOGUE,
        useValue: Catalogue,
    },
    {
        provide: PROVIDERS_NAMES.COMMUN_COMPANY,
        useValue: Company,
    },
];