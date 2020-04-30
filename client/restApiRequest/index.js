import http from './http';

const methods = {
  get: 'get',
  create: 'post',
  update: 'put',
  delete: 'delete',
};

const restAPIRequest = ({ collection, actionType, id = '', params, data }) =>
  http({
    method: methods[actionType],
    url: `/${collection}/${id}`,
    params,
    data,
  }).then(response => response.data);

export default restAPIRequest;
