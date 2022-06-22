import React, {useEffect, useState} from 'react';

const ChildTest = (props) => {
    const [time, setTime] = useState(props.time);

    useEffect(() => {
        setTime(props.time);
    }, [props.time])

    const renderChild = () => {
        return (
            <div>{time.toLocaleTimeString()}</div>
        )
    }

    return (
        <div>
            {renderChild()}
        </div>
    )
}

export default ChildTest;