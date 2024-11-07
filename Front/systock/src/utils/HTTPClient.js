export default class HTTPClient {
  constructor(route) {
    this.route = route;
  }
  baseURL = "192.168.15.15:3333";

  async get(headers = {}) {
    return this.request("GET", null, headers);
  }

  async post(body, headers = {}) {
    return this.request("POST", body, headers);
  }

  async put(body, headers = {}) {
    return this.request("PUT", body, headers);
  }

  async delete(headers = {}) {
    return this.request("DELETE", null, headers);
  }

  async patch(body, headers = {}) {
    return this.request('PATCH', body, headers);
  }

  async request(method, body = null, headers = {}) {
    const url = `http://${this.baseURL}${this.route}`;

    const contentJSON = body !== null ? { 'Content-Type': 'application/json' } : {};
    const options = {
      method,
      headers: {
        ...contentJSON,
        "Authorization" : `Bearer ${window.localStorage.getItem('tokenLogin')}`,
        ...headers,
      }
    };

    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        try {
          const errorResponse = await response.json();

          throw new Error(errorResponse.Message);
        } catch (e) {
          throw new Error(e);
        }
      }

      try {
        return await response.json();
      } catch {
        return await response.text();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}