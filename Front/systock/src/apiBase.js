export const apiBase = 'http://25.4.63.160:3333';

export function performFetch(url, obj) {
  return new Promise((resolve, reject) => {
    fetch(`${apiBase}${url}`, { method: 'GET', ...obj })
      .then(response => {
        if(!response.ok) {
          throw new Error('Request failed with status ' + response.status);
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error))
  });
}