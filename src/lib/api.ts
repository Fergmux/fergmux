class API {
  async get(url: string) {
    return await fetch(url).then((response) => response.json())
  }

  async post(url: string, data: unknown) {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((response) => response.json())
  }
}

export default new API()
