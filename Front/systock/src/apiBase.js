// export const apiBase = 'http://25.4.63.160:3333';
export const apiBase = 'http://192.168.15.12:3333';

export function performFetch(url, obj) {
  return new Promise((resolve, reject) => {
    fetch(`${apiBase}${url}`, { method: 'GET', 
    headers: { "Content-Type" : "application/json" }
    ,...obj })
      .then(response => {
        if(!response.ok) {
          if (response.status === 401) {
            throw new Error('Request failed with status ' + response.status);
          }
          if (response.status === 404) {
            //* not found
          }
          if (response.status === 418) {
            //* unauthorized
          }
          return response.json().then(json => {
            return Promise.reject({
              status: response.status,
              ok: false,
              statusText: response.message,
              body: json
            });
          });
        }
        
        return response;
      })
      .then(data => resolve(data.json()))
      .catch(error => reject(error))
  });
}

export function performFetchNoResult(url, obj) {
  return new Promise((resolve, reject) => {
    fetch(`${apiBase}${url}`, { method: 'GET', 
    headers: { "Content-Type" : "application/json" }
    ,...obj })
      // .then(response => {
      //   if(!response.ok) {
      //     if (response.status === 401) {
      //       throw new Error('Request failed with status ' + response.status);
      //     }
      //     if (response.status === 404) {
      //       //* not found
      //     }
      //     if (response.status === 418) {
      //       //* unauthorized
      //     }
      //     return response.json().then(json => {
      //       return Promise.reject({
      //         status: response.status,
      //         ok: false,
      //         statusText: response.message,
      //         body: json
      //       });
      //     });
      //   }
        
      //   return response;
      // })
      .then(data => resolve(data))
      .catch(error => reject(error))
  });
}