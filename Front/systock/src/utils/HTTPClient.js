export default class HTTPClient {
  constructor(route) {
    this.route = route;
  }
  baseURL = "";

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
    const url = `${this.baseURL}${this.route}`;

    const contentJSON = body !== null ? { 'Content-Type': 'application/json' } : {};
    const options = {
      method,
      headers: {
        ...contentJSON,
        ...headers
      }
    };

    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(url, options);

      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}