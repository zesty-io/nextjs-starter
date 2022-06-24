// fetchRedirects, get the list of all redirects set in the content manager, loads into next.config.js
export async function fetchZestyRedirects() {
    let productionMode =
    undefined === process.env.PRODUCTION || process.env.PRODUCTION === 'true'
      ? true
      : false;

    let zestyURL = productionMode
    ? process.env.zesty.production
    : process.env.zesty.stage;
  zestyURL = zestyURL.replace(/\/$/, '');

  // access the headless url map
 let routesAPIURL = zestyURL+'/-/headless/redirects.json?zpw=' + process.env.zesty.stage_password;
 try {
   const routes = await fetch(routesAPIURL);
   return await routes.json();

 } catch (err){
   console.log(err)
   return []
 }
}
