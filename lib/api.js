export async function fetchZestyPage(url,getNavigation=true) {
  let data = {
    error: true,
  };
  // grab the path without a query string
  url = url.split('?')[0]
  // if there is query string, get it 
  let queryString = url.split('?').length > 1 ? url.split('?')[1] : ''

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
  // uses .env and .env local values to determine stage or production 
  let productionMode = (undefined === process.env.PRODUCTION || process.env.PRODUCTION === 'true') ? true : false;
  let zestyURL = productionMode ? process.env.zesty.production : process.env.zesty.stage;
  zestyURL = zestyURL.replace(/\/$/, '')
  let zestyJSONURL = zestyURL.replace(/\/$/, '') + '/' + url + '?toJSON&' + queryString ;

  // Fetch data from Zesty.io toJSON API
  const res = await fetch(zestyJSONURL);

  // otherwise set response to data
  if (res.status == 200) {
    data = await res.json();
  } else {
    data.status = res.status;
  }

  // setup zesty values
  data.zestyProductionMode = productionMode;
  data.zestyInstanceZUID = process.env.zesty.instance_zuid;
  data.zestyBaseURL = zestyURL;

  // fetch the navigation and append the navigation to the data
  // to turn off, pass false as second value in zestyFetchPage in pages/index.js and pages/[..slug].js
  if(getNavigation == true){
    data.zestyNavigationTree = await buildJSONTreeFromNavigation(zestyURL)
  }

  return data;
}

// buildJSONTreeFromNavigation: Navigation fetch to zesty headless endpoint that return routes
async function buildJSONTreeFromNavigation(zestyURL){
  // access the headless url map
 let navJSON = zestyURL+'/-/headless/routing.json';
 try {
   const routes = await fetch(navJSON);
   let routeData = await routes.json();
   let reducedData = []
   routeData.forEach(async route => {
       let tempRoute = {
         url: route.uri,
         title: route.title
       };
       reducedData.push(tempRoute)
   
   }) 
  return reducedData
 } catch (err){
   console.log(err)
   return []
 }
}