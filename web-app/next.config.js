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
        webpack: function (config, options) {
            console.log(options.webpack.version); // 5.18.0
            config.experiments = { asyncWebAssembly: true, layers: true };
            return config;
        }
    })
);
