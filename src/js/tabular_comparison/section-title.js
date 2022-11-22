import React, {useMemo} from "react";

const SectionTitle = (props) => {

    const testId = useMemo(
      () => props.children.toLowerCase().replace(" ", "-"), [
        props.children
      ]
    );

    return (
        <div className={'section-title'} data-testid={testId}>{props.children}</div>
    );
}

export default SectionTitle;
