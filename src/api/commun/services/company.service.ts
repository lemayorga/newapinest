import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_NAMES } from '../commun.provider';
import { Company } from 'src/database/models/commun';
import { RepositoryCrudService } from 'src/api/shared/services/base_crud.service';
import { CompanyCreateDto, CompanyDto, CompanyUpdateDto } from '../dtos';

@Injectable()
export class CompanyService  extends RepositoryCrudService<Company, CompanyDto, CompanyCreateDto , CompanyUpdateDto> {
    constructor(
      @Inject(PROVIDER_NAMES.COMMUN_COMPANY) private readonly repository: typeof Company
    ){
     super(Company);
    }
}


