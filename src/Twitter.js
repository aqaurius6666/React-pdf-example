import './Twitter.css';
import { useState } from 'react';
import { ElfsightEmbedSDK } from '@elfsight/embed-sdk';
function Twitter() {
    // const Embedded = ElfsightEmbedSDK.displayWidget(ReactDOM.querySelector('#widget-container'), widget.id)
    return (
        <>
            <div id="widget-container"></div>
            {/* <Embedded/> */}
        </>
    );
}

export default Twitter;
