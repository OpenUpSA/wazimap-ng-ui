import React, {useState} from 'react';

const ReactTest = () => {
    const someRenderTitle = () => {
        return (
            <a href={'#'} className={'test-btn'}>Did it work?</a>
        )
    }

    return (
        <div>
            {someRenderTitle()}
        </div>
    )
}

export default ReactTest;