import React, {useEffect, useState} from 'react';
import ChildTest from "./child-test";

const ParentTest = (props) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const renderTitle = () => {
        return (
            <div className={'test-btn'}>Child last updated :
                <ChildTest
                    time={time}
                />
            </div>
        )
    }

    return (
        <div>
            {renderTitle()}
        </div>
    )
}

export default ParentTest;