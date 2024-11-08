import DevTools from 'svelte-dev-tools';

function changeHost(value) {
  sessionStorage.setItem('wazi-hostname', value);
  window.location.reload(false);
}

function changeAPIUrl(value) {
  sessionStorage.setItem('wazi.apiUrl', value);
  window.location.reload(false);
}


function changePanel(value) {
  sessionStorage.setItem('wazi.defaultPanel', value);
  window.location.reload(false);
}

function enableServer(value) {
  sessionStorage.setItem('wazi.localServer', value);
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
    },
    { type: 'input',
      title: 'API Url',
      callback: changeAPIUrl,
      values: 'API Url'
    },
    { type: 'checkbox',
      title: 'enable Local Server',
      callback: enableServer,
      values: true
    },
    { type: 'select',
      title: 'Default Panel',
      callback: changePanel,
      values: [
        {title: 'Rich Data', value: 1},
        {title: 'Point Mapper', value: 2},
        {title: 'Data Mapper', value: 3}
      ]
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
  let profileUrl = 'https://api.wazimap.com/api/v1/profiles';
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
