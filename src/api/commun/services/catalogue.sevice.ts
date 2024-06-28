import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_NAMES } from '../commun.provider';
import { Catalogue } from 'src/database/models/commun';
import { RepositoryCrudService } from 'src/api/shared/services/base_crud.service';
import { CatalogueCreateDto, CatalogueDto, CatalogueUpdateDto } from '../dtos';
import { PageMeta, PageOptionsDto, SortOrder } from 'src/api/shared/models';
import { PaginationService } from 'src/api/shared/services';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class CatalogueService extends RepositoryCrudService<Catalogue, CatalogueDto, CatalogueCreateDto, CatalogueUpdateDto> {
    constructor(
      @Inject(PROVIDER_NAMES.COMMUN_CATALOGUE) private readonly repository: typeof Catalogue,
      private paginationService: PaginationService
    ){
     super(Catalogue);
    }
    public async paginate(options: PageOptionsDto, order_by?: string) {
      let paginationOptions: PageMeta = new PageMeta(options.take, options.page);

       if (options.searchs) {
         paginationOptions.searchs = {
             where: {
              [Op.or]:[
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('group')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('value')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              ]
             }
         };
       }


       const transform = (records: CatalogueDto[]): CatalogueDto[] => {
         const result: CatalogueDto[] = records.map(record => {
             return   {
                 id: record.id,
                 group: record.group,
                 value: record.value,
                 isActive: record.isActive,
                 description: record.description
             } 
         }) ;
         return result;
      }

       if (order_by && options.order) {
         paginationOptions.order.push([order_by, options.order]);
       }else{
         paginationOptions.order.push(['id', options.order ?? SortOrder.ASC]);
       }
  
       const result = await this.paginationService.paginante<CatalogueDto>(Catalogue, paginationOptions, transform);
       return result;
   }
}
