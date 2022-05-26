import React from 'react';

class Crisp extends React.Component {
    componentDidMount() {
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = '52302e6c-66ff-4f36-b161-8ac5954cfc65';
        (function () {
            let d = document;
            let s = d.createElement('script');
            s.src = 'https://client.crisp.chat/l.js';
            s.async = 1;
            d.getElementsByTagName('head')[0].appendChild(s);
        })();
    }

    render() {
        return null;
    }
}
export default Crisp;
