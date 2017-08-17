import React,{Component} from "react";
import ReactDOM from "react-dom";
import "./index.less"

class Hello extends React.Component {
    static defaultProps = {}

    static propTypes = {}

    state = {};

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="indexClass">
            {__DEV__?"this is dev mode":"this is pub mode"}
        </div>
    }
}

ReactDOM.render(<Hello/>,document.body);