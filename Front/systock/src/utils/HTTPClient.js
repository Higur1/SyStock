import { getErrorMessage } from "./utils";

export default class HTTPClient {
  constructor(route) {
    this.route = route;
  }
  baseURL = "192.168.15.15:3333";

  async get(headers = {}, param = "") {
    return this.request("GET", null, headers, param);
  }

  async post(body, headers = {}) {
    return this.request("POST", body, headers);
  }

  async put(body, headers = {}) {
    return this.request("PUT", body, headers);
  }

  async delete(headers = {}, param = "") {
    return this.request("DELETE", null, headers, param);
  }

  async patch(body, headers = {}) {
    return this.request('PATCH', body, headers);
  }

  async request(method, body = null, headers = {}, param = "") {
    const url = `http://${this.baseURL}${this.route}${param}`;

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
        const errorResponse = await response.json();

        const secondaryError = errorResponse.Message || errorResponse.Error || null;
        throw getErrorMessage(method, this.route, response.status, secondaryError);
      }

      try {
        return await response.json();
      } catch {
        return await response.text();
      }
    } catch (error) {
      console.log(`ERRO API ${this.route} - method: ${method}: ${error}`);
      throw getErrorMessage(method, this.route, 1000, error);
    }
  }
}