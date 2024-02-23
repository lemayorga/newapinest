import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_NAMES } from '../commun.provider';
import { Catalogue } from 'src/database/models/commun';
import { RepositoryCrudService } from 'src/api/shared/services/base_crud.service';
import { CatalogueCreateDto, CatalogueDto, CatalogueUpdateDto } from '../dtos';

@Injectable()
export class CatalogueService extends RepositoryCrudService<Catalogue, CatalogueDto, CatalogueCreateDto, CatalogueUpdateDto> {
    constructor(
      @Inject(PROVIDER_NAMES.COMMUN_CATALOGUE) private readonly repository: typeof Catalogue
    ){
     super(Catalogue);
    }
}

/*
{
  "search": [
    {
        "name": "description",
        "value": "fff",
        "operation": "LIKE"
    }
  ],
  "order": [],
  "include": [ ],
  "group": [ ]
}

{
  "search": [
    {
        "name": "description",
        "value": "ff",
        "operation": "LIKE"
    },
    {
        "name": "group",
        "value": "ff",
        "operation": "LIKE"
    },
    {
        "name": "value",
        "value": "ff",
        "operation": "LIKE"
    }
  ]
}

*/