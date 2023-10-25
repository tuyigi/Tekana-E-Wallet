import { SelectQueryBuilder, Repository } from 'typeorm';

interface PaginationOptions {
  pageSize?: number;
  pageNumber?: number;
  filter?: Record<string, any>;
  relations?: string[];
  orderColumn?: string;
}

export class FilterHelper<T> {
  constructor(private repository: Repository<T>) {}

  /**
   * Paginate any result set from any table
   * @param pageSize
   * @param pageNumber
   * @param filter
   * @param relations
   * @param orderColumn
   */
  async paginate({
    pageSize,
    pageNumber,
    filter = {},
    relations = [],
    orderColumn = 'created_at',
  }: PaginationOptions): Promise<any> {
    const queryBuilder = this.createFilteredQueryBuilder(
      filter,
      relations,
      orderColumn,
    );
    /**
     * If page side and page number provided
     */

    if (pageSize && pageNumber) {
      const take = pageSize || 10;
      const page = Number(pageNumber) || 1;
      const skip = (page - 1) * take;

      const [list, total] = await queryBuilder
        .take(take)
        .skip(skip)
        .getManyAndCount();

      const lastPage = Math.ceil(total / take);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

      return {
        list,
        total,
        previousPage: prevPage,
        nextPage,
        lastPage,
        currentPage: page,
      };
    } else {
      const list = await queryBuilder.getMany();
      return {
        list,
      };
    }
  }

  /**
   * Filter in any table with any column , alongside with its tables in relationship
   * This will be used by any service among all microservices
   * @param filter
   * @param relations
   * @param orderColumn
   * @private
   */

  private createFilteredQueryBuilder(
    filter: Record<string, any>,
    relations: string[],
    orderColumn: string,
  ): SelectQueryBuilder<T> {
    const queryBuilder = this.repository.createQueryBuilder();

    /**
     * Add relations if provided
     */
    if (relations.length > 0) {
      relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }
    /**
     * Add filtering conditions
     */
    Object.keys(filter).forEach((key) => {
      if (filter[key] !== null) {
        queryBuilder.andWhere(`entity.${key} = :${key}`, {
          [key]: filter[key],
        });
      }
    });
    /**
     * Add ordering
     */
    queryBuilder.orderBy(
      `entity.${orderColumn}`,
      orderColumn === 'created_at' ? 'DESC' : 'ASC',
    );

    return queryBuilder;
  }
}
