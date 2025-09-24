/**
 * Wrap XHR in promise
 *
 * @param url
 * @param method
 * @param data
 * @param options
 * @returns {Promise<unknown>}
 */
function makeRequest(url, method, data = null, options = {}) {
  // Create the XHR request
  const request = new XMLHttpRequest();

  // Return it as a Promise
  return new Promise(function(resolve, reject) {
    // Setup our listener to process compeleted requests
    request.onreadystatechange = function() {
      // Only run if the request is complete
      if (request.readyState !== 4) return;

        // Process the response
        resolve(JSON.parse(request.responseText));
    };

    // Setup our HTTP request
    request.open(method || 'GET', url, true);

    // Send the request
    if (data) {
      if (options.contentType) {
        const contentType = options.contentType || 'application/json;charset=UTF-8';
        request.setRequestHeader(
          'Content-Type',
          contentType
        );
        request.send(JSON.stringify(data));
      }

      request.send(data);
    } else {
      request.send(data);
    }
  });
}

export default makeRequest;
