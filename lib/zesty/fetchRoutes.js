// buildJSONTreeFromNavigation: Navigation fetch to zesty headless endpoint that return routes
export async function fetchZestyRoutes() {
    let productionMode =
    undefined === process.env.PRODUCTION || process.env.PRODUCTION === 'true'
      ? true
      : false;

    let zestyURL = productionMode
    ? process.env.zesty.production
    : process.env.zesty.stage;
  zestyURL = zestyURL.replace(/\/$/, '');

  // access the headless url map
 let routesAPIURL = zestyURL+'/-/headless/routing.json?zpw=' + process.env.zesty.stage_password;
 try {
   const routes = await fetch(routesAPIURL);
   let routeData = await routes.json();
   let reducedData = []
   //  url: route.uri,
//    title: route.title,
//    zuid: route.zuid
    routeData.forEach(route => {
        if(route.uri !== '/') {  // ignore homepage for path
            reducedData.push({
                params: {
                    "slug": route.uri.replace(/^\/|\/$/g,'').split('/'), 
                    "locale": "en"
                }
            })
        }
    }) 

    return reducedData
 } catch (err){
   console.log(err)
   return []
 }
}
