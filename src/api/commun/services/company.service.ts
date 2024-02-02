import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS_NAMES } from 'src/core';
import { Company } from 'src/database/models/commun';
import { RepositoryCrudService } from 'src/api/shared/services/base_crud.service';
import { CompanyCreateDto, CompanyDto, CompanyUpdateDto } from '../dtos';

@Injectable()
export class CompanyService  extends RepositoryCrudService<Company, CompanyDto, CompanyCreateDto , CompanyUpdateDto> {
    constructor(
      @Inject(PROVIDERS_NAMES.COMMUN_COMPANY) private readonly repository: typeof Company
    ){
     super(Company);
    }
}


