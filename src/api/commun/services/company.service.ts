import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_NAMES } from '../commun.provider';
import { Op, Sequelize } from 'sequelize';
import { Company } from 'src/database/models/commun';
import { RepositoryCrudService } from 'src/api/shared/services/base_crud.service';
import { CompanyCreateDto, CompanyDto, CompanyUpdateDto } from '../dtos';
import { PageDto, PageMeta, PageOptionsDto, SortOrder } from 'src/api/shared/models';
import { PaginationService } from 'src/api/shared/services';

@Injectable()
export class CompanyService  extends RepositoryCrudService<Company, CompanyDto, CompanyCreateDto , CompanyUpdateDto> {
    constructor(
      @Inject(PROVIDER_NAMES.COMMUN_COMPANY) private readonly repository: typeof Company,
      private paginationService: PaginationService
    ){
     super(Company);
    }


    public async paginate(options: PageOptionsDto, order_by?: string): Promise<PageDto<CompanyDto>>  {
       let paginationOptions: PageMeta = new PageMeta(options.take, options.page);

        if (options.searchs) {
          paginationOptions.searchs = {
              where: {
                [Op.or]:[
                  Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  })
                ]
               }
          };
        }

        const transform = (records: Company[]): CompanyDto[] => {
          const result: CompanyDto[] = records.map(record => {
              return   {
                  id: record.id,
                  name: record.name,
                  isActive: record.isActive,
                  companySuccessorId: record.companySuccessorId
              } 
          }) ;
          return result;
       }

        if (order_by && options.order) {
          paginationOptions.order.push([order_by, options.order]);
        }else{
          paginationOptions.order.push(['id', options.order ?? SortOrder.ASC]);
        }
   
        const result = await this.paginationService.paginante<CompanyDto>(Company, paginationOptions, transform);
        return result;
    }
}


