import DevTools from 'svelte-dev-tools';

function changeHost(value) {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set("hostname", value);
  window.location.search = searchParams.toString();
}
let tools = [
  { type: 'select',
    title: 'Hostname',
    callback: changeHost,
    values: [
      {title: 'Youthexplorer', value: 'beta.youthexplorer.org.za'},
      {title: 'GCRO', value: 'gcro.openup.org.za'}
    ]
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
