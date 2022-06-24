// fetchZestyRoutes
// Used for Static Generated builds to feed getStaticPaths
// 

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
  routeData.forEach(route => {
    if(route.uri !== '/') {  // ignore homepage for path
        reducedData.push({
            params: {
                "slug": route.uri.replace(/^\/|\/$/g,'').split('/'),   
            },
            locale: route.locale
        })
    }
  }) 

    return reducedData
 } catch (err){
   console.log(err)
   return []
 }
}
