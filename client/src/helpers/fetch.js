function get(url, params, encodedCredentials) {
  return request(url, params, "GET", encodedCredentials);
}

function create(url, params, encodedCredentials) {
  return request(url, params, "POST", encodedCredentials);
}

function update(url, params, encodedCredentials) {
  return request(url, params, "PUT", encodedCredentials);
}

function remove(url, params, encodedCredentials) {
  return request(url, params, "DELETE", encodedCredentials);
}

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => key + "=" + obj[key])
    .join("&");
}

async function request(url, params, method, encodedCredentials) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  // if params exists and method is GET, add query string to url
  // otherwise, just add params as a "body" property to the options object
  if (params) {
    if (method === "GET" && params !== null && params !== undefined) {
      url += "?" + objectToQueryString(params);
    } else {
      options.body = JSON.stringify(params); // body should match Content-Type in headers option
    }
  }

  if (encodedCredentials) {
    options.headers.Authorization = `Basic ${encodedCredentials}`;
  }
  const response = await fetch(process.env.REACT_APP_URL + url, options);

  return response;
}

export default {
  get,
  create,
  update,
  remove
};
