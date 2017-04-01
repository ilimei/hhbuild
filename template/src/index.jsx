import React,{Component} from "react";
import ReactDOM from "react-dom";

class Hello extends React.Component {
    static defaultProps = {}

    static propTypes = {}

    state = {};

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="Hello">
            {__DEV__?"true":"false"}
            {JSON.stringify(list)}
        </div>
    }
}

ReactDOM.render(<Hello/>,document.body);