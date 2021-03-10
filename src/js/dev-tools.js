import DevTools from 'svelte-dev-tools';

function changeHost(value) {
  sessionStorage.setItem('wazi-hostname', value);
  window.location.reload(false);
}

function tools(profiles) {
  let hostnames = profiles.map((profile) => {
    if(profile.configuration && profile.configuration.urls) {
      return profile.configuration.urls.map((url) => {
        return { title: `${profile.name} - ${url}`, value: url }
      })
    }
  }).flat(1).filter(v => v)
  let tools = [
    { type: 'select',
      title: 'Hostname',
      callback: changeHost,
      values: hostnames
    },
    { type: 'input',
      title: 'Hostname',
      callback: changeHost,
      values: 'Hostname'
    }
  ]
  return tools;
}

async function getProfileData(profileUrl) {
  let next = true;
  let data = []
  while(next) {
    const response = await fetch(profileUrl)
    const profileJson = await response.json();
    if(profileJson["next"]) {
      profileUrl = profileJson["next"];
    } else { next = false; }
    data = data.concat(profileJson["results"])
  }
  return data;
}

export async function install() {
  let data = []
  let profileUrl = 'https://production.wazimap-ng.openup.org.za/api/v1/profiles';
  let stagingProfileUrl = 'https://staging.wazimap-ng.openup.org.za/api/v1/profiles';
  data = data.concat(await getProfileData(profileUrl))
  data = data.concat(await getProfileData(stagingProfileUrl))
  const devtools = new DevTools({
    target: document.body,
    props: {
      tools: tools(data),
      env: process.env.NODE_ENV
    }
  });
}
