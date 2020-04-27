/**
 * List module enriches request results by sort, search & pagination.
 */
class ListFeatures {
  constructor(ModelDB, query) {
    this.ModelDB = ModelDB;
    this.query = query;
    this.defaultSortBy = '-createdAt';
  }

  /**
   *
   * @returns {Promise<*>}
   * @private
   */
  async _getPagesQuantity() {
    const queryFilter = this.getQueryFilter();

    if (queryFilter) {
      return await this.ModelDB.find(queryFilter).countDocuments();
    }
    return await this.ModelDB.estimatedDocumentCount();
  }

  /**
   *
   * @returns {number}
   */
  getLimit() {
    return Number(this.query.limit) || 0;
  }

  /**
   *
   * @param pagesQuantity
   * @returns {number}
   */
  getTotalPages(pagesQuantity) {
    const resultsLimit = this.getLimit();

    return resultsLimit ? Math.ceil(pagesQuantity / resultsLimit) : 1;
  }

  /**
   *
   * @param totalPages
   * @returns {number}
   */
  getCurrentPage(totalPages) {
    const { page } = this.query;
    const currentPage = page && Number(page) > 0 ? Number(page) : 1;

    return totalPages > currentPage ? currentPage : totalPages;
  }

  /**
   *
   * @param resultsLimit
   * @param currentPage
   * @returns {number}
   */
  getSkip(resultsLimit, currentPage) {
    return resultsLimit * (currentPage - 1);
  }

  /**
   *
   * @returns {object|null}
   */
  getQueryFilter() {
    const { search } = this.query;

    return search ? { title: { $regex: search } } : null;
  }

  /**
   *
   * @param sortableFields
   * @returns {string}
   */
  getSort(sortableFields) {
    const { sort } = this.query;

    const sortByList = sort.split(',').filter(sortField => {
      const reg = new RegExp('^(-?)(.*)$', 'i');
      const fieldName = sortField.replace(reg, '$2');

      return sortableFields.includes(fieldName);
    });
    return sortByList.length ? sortByList.join(' ') : this.defaultSortBy;
  }

  /**
   *
   * @returns {Promise<{itemsPerPage: (number), totalPages: number, currentPage: number}>}
   */
  async getPaginationParameters() {
    const pagesQuantity = await this._getPagesQuantity();
    const resultsLimit = this.getLimit();
    const totalPages = await this.getTotalPages(pagesQuantity);
    const currentPage = this.getCurrentPage(totalPages);
    const itemsPerPage = resultsLimit || pagesQuantity;

    return {
      currentPage,
      itemsPerPage,
      limit: resultsLimit,
      skip: this.getSkip(resultsLimit, currentPage),
      totalPages,
    };
  }
}

module.exports = ListFeatures;
