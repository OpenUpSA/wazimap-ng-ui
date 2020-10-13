import DevTools from 'svelte-dev-tools';

function changeHost(value) {
  sessionStorage.setItem('wazi-hostname', value);
  window.location.reload(false);
}
let tools = [
  { type: 'select',
    title: 'Hostname',
    callback: changeHost,
    values: [
      {title: 'Youthexplorer', value: 'beta.youthexplorer.org.za'},
      {title: 'GCRO', value: 'gcro.openup.org.za'},
      {title: 'Sifar', value: 'sifar-wazi.openup.org.za'},
      {title: 'Vulekamali', value: 'geo.vulekamali.gov.za'},
      {title: 'Public - 2011 SA Boundaries', value: 'wazimap-ng.africa'},
      {title: 'GIZ', value: 'giz-projects.openup.org.za'},
      {title: 'Cape Town Against Covid-19', value: 'capetownagainstcovid19.openup.org.za'},
      {title: 'Covid-Wazi', value: 'covid-wazi.openup.org.za'},
      {title: 'mapyourcity', value: 'mapyourcity.org.za'}
    ]
  },
  { type: 'input',
    title: 'Hostname',
    callback: changeHost,
    values: 'Hostname'
  }
]
export function install() {
  const devtools = new DevTools({
    target: document.body,
    props: {
      tools: tools,
      env: process.env.NODE_ENV
    }
  });
}
