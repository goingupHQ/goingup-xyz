const calendarTranspile = require('next-transpile-modules')([
    '@fullcalendar/common',
    '@fullcalendar/react',
    '@fullcalendar/daygrid',
    '@fullcalendar/list',
    '@fullcalendar/timegrid'
]);

const withImages = require('next-images');

module.exports = withImages(
    calendarTranspile({
        i18n: {
            defaultLocale: 'en',
            locales: ['en']
        },
        // webpack: function (config, options) {
        //     config.experiments = { asyncWebAssembly: true, layers: true };

        //     if (options.isServer) {
        //         config.output.webassemblyModuleFilename =
        //             './../static/wasm/[modulehash].wasm';
        //     } else {
        //         config.output.webassemblyModuleFilename =
        //             'static/wasm/[modulehash].wasm';
        //     }

        //     return config;
        // }
    })
);
