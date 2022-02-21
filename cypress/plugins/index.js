const CDP = require('chrome-remote-interface')
const debug = require('debug')('cypress:server:protocol')


let client = null;
let port = 0;

function ensureRdpPort (args) {
    const existing = args.find((arg) => arg.slice(0, 23) === '--remote-debugging-port')

    if (existing) {
        return Number(existing.split('=')[1])
    }

    const port = 40000 + Math.round(Math.random() * 25000)

    args.push(`--remote-debugging-port=${port}`)

    return port
}

const cucumber = require('cypress-cucumber-preprocessor').default
const { isFileExist } = require('cy-verify-downloads');
module.exports = (on, config) => {
    on('file:preprocessor', cucumber())
    on('before:browser:launch', (browser, launchOptionsOrArgs) => {
        debug('browser launch args or options %o', launchOptionsOrArgs)
        const args = Array.isArray(launchOptionsOrArgs) ? launchOptionsOrArgs : launchOptionsOrArgs.args

        port = ensureRdpPort(args)
        debug('ensureRdpPort %d', port)
        debug('Chrome arguments %o', args)
    })
    on('task', {
        resetCRI: async () => {
            if (client) {
                debug('resetting CRI client')
                await client.close()
                client = null
            }

            return Promise.resolve(true)
        },
        activatePrintMediaQuery: async () => {
            debug('activatePrintMediaQuery')
            client = client || await CDP({port})

            return client.send('Emulation.setEmulatedMedia', {media: 'print'})
        },
    });
    on('task', { isFileExist });
}
