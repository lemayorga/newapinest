
import { Injectable } from '@nestjs/common';
import { PageDto, PageMeta } from '../models/paginate-query.model';


@Injectable()
export class PaginationService {

/**
 * Paginate items from model data base
 * @model  model to use 
 * @pageOpt page parameters for pagination from model register
 * @transform callback function to execute after paginate , usually it's function that convert model to dto
 * @return  Promise<PageDto<Type>>
 */
  public async paginante<Type>(model , pageOpt: PageMeta,  transform = null): Promise<PageDto<Type>>{ 
         
        const { take, pageSize , searchs, order } = pageOpt;

        // create an options object
        let options = { };

        options = {
            offset: this.getOffset(pageSize, take),
            limit: take,
        };
        
       // check if the search object is empty
       if (Object.keys(searchs).length) {
             options = { options, ...searchs};
        }

      // check if the order array is empty
      if (order && order.length) {
           options['order'] = order;
       }


       // take in the model, take in the options
       let { count , rows } = await model.findAndCountAll(options);

       // check if the transform is a function and is not null
       if (transform && typeof transform === 'function') {
             rows = transform(rows);
        }

        let r = {
            previousPage: this.getPreviousPage(pageSize),
            currentPage: pageSize,
            nextPage: this.getNextPage(pageSize, take, count),
            total: count ,
            take: take,
            data: rows
        } as PageDto<Type>;
        return r;
  }


   private getOffset (page: number, limit: number) {
    return (page * limit) - limit;
   }

   private getNextPage (page: number, limit: number, total: number){
    if ((total/limit) > page) {
        return page + 1;
    }

    return null
   }

   private getPreviousPage (page: number) {
    if (page <= 1) {
        return null
    }
    return page - 1;
   }
}