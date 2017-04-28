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
            {__DEV__?"true":"false"}
            {JSON.stringify(list)}123123
        </div>
    }
}

ReactDOM.render(<Hello/>,document.body);