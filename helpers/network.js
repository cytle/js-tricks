import wAlert from 'widget/alert';


const fetchByJqueryAjax = (args, resolve, reject) => {
  $.ajax(...args)
    .success(resolve)
    .error(reject);
};


export const fetchByJquery = (...args) => {
  return new Promise((resolve, reject) => {
    fetchByJqueryAjax(args, resolve, reject);
  })
  .then(
  json => {
    if (json.status === 0) {
      return Promise.resolve(json);
    }
    let msg = json.msg;

    switch (json.status) {
      case 2: msg = '未登录'; break;
      case 3: msg = '没有权限'; break;
      default: msg = json.msg;
    }

    wAlert(msg, 'error');
    return Promise.reject(json);
  },
  response => {
    let json;
    if (response.responseJSON && response.responseJSON.status) {
      json = response.responseJSON;
    } else {
      json = {
        status: 1,
        msg: '服务器异常',
        data: null
      };
    }

    if (json.status !== 0) {
      wAlert(json.msg, 'error');
      return Promise.reject(json);
    }
    return Promise.resolve(json);
  }
  );
};


export const fetchJsonDataByJquery = (...args) =>
  fetchByJquery(...args)
  .then(
    json => Promise.resolve(json.data, json),
    Promise.reject
    );


export const fetchJsonData = fetchJsonDataByJquery;
