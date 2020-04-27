// const ListFeatures = require('../../utils/ListFeatures');
// Test is freezed till find best way to mock mongoose model.

describe('ListFeatures', () => {
  describe('init', () => {
    test('should create instance with Model and query properties', () => {});
  });
  describe('_getPagesQuantity', () => {
    test('should trigger getQueryFilter method', () => {});
    test('should use countDocuments with queryFilter if is defined', () => {});
    test('should use estimatedDocumentCount method if no queryFilter provided', () => {});
  });
  describe('getLimit', () => {
    test('should return numbered limit value or 0 if no limit provided', () => {});
  });
  describe('getTotalPages', () => {
    test('should trigger getLimit method', () => {});
    test('should return available page number', () => {});
  });
  describe('getCurrentPage', () => {
    test('should return numbered current page number value', () => {});
    test('should return last page number if requested page is bigger than the last one', () => {});
  });
  describe('getSkip', () => {
    test('should return proper items quantity to skip for current page', () => {});
  });
  describe('getQueryFilter', () => {
    test('should return filter object if query.search is provided', () => {});
    test('should return null if query.search is not provided', () => {});
  });
  describe('getSort', () => {
    test('should filter provided field names by sortable fields list', () => {});
    test('should return filtered sortable list separated by empty string', () => {});
    test('should return default sort value if no proper custom provided', () => {});
  });
  describe('getPaginationParameters', () => {
    test('should trigger _getPagesQuantity getLimit, getTotalPages and getCurrentPage methods', () => {});
    test('should return pagination parameters: currentPage, itemsPerPage, limit, skip and totalPages', () => {});
  });
});
