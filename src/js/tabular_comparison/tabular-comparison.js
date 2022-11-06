import React from "react";

//components
import Header from "./header";
import Body from "./body";

//css
import './tabular-comparison.module.css';

const TabularComparison = (props) => {
    return (
        <div>
            <Header />
            <Body />
        </div>
    );
}

export default TabularComparison;