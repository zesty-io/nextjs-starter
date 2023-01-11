// fetchRedirects, get the list of all redirects set in the content manager, loads into next.config.js
async function fetchZestyRedirects(zestyConfig) {

  let productionMode =
  process.env.PRODUCTION === 'true' || process.env.PRODUCTION === true
    ? true
    : false;

  let zestyURL = productionMode ? zestyConfig.production : zestyConfig.stage;

  zestyURL = zestyURL.replace(/\/$/, '');

  // access the headless url map
  let redirectsAPIURL = zestyURL+'/-/headless/redirects.json?zpw=' + zestyConfig.stage_password;
  try {
    const req = await fetch(redirectsAPIURL);
    let redirects = await req.json();
    let redirectsForNext = []
    redirects.forEach(r => {
      redirectsForNext.push({
        source: r.path,
        destination: r.target,
        permanent: r.code == 301 ? true : false,
      })
    })
    return redirectsForNext;

  } catch (err){
    console.log(err)
    return []
  }
}

module.exports = { fetchZestyRedirects };
