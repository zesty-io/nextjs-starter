export async function fetchPage(url) {
  let data = {
    error: true,
  };

  // If the URL contains a file extension then error out
  // In the context of nextjs when fetching data for a page
  // it should be done via an absolute path
  if (url.split('.').length > 1) {
    return data;
  }

  // url is missing ending forward slash, add it (zesty expects one)
  if (url.substr(-1) !== '/') {
    url = url + '/';
  }

  // remove first forward slash
  url = url.replace(/^\//, '');

  // build relative zesty toJSON url to fetch JSON
  // TODO: this will need to account for additional query parameters and append it to ?toJSON
  let zestyURL = `${process.env.zesty.stage}`;
  zestyURL = zestyURL.replace(/\/$/, '') + '/' + url + '?toJSON';

  // Fetch data from Zesty.io toJSON API
  const res = await fetch(zestyURL);

  // otherwise set response to data
  if (res.status == 200) {
    data = await res.json();
  } else {
    data.status = res.status;
  }

  return data;
}
