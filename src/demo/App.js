/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';

import { DashTextAnnotate } from '../lib';

class App extends Component {

    constructor() {
        super();
        this.state = {
            text: 'Test Text from React', // Text that should get annotated
            entities: [{
                "start": 5,
                "end": 9,
                "tag": "DATE"
              }], // Currently selected entities
            tag: 'DATE', // Currently selected tag (Managed by Dash)
            tag_color: 'GREEN', // Currently selected tag color (Managed by Dash)
        };
        this.setProps = this.setProps.bind(this);
    }

    setProps(newProps) {
        this.setState(newProps);
    }

    render() {
        // console.log(this.state.entities)
        return (
            <div>
                <DashTextAnnotate
                    setProps={this.setProps}
                    {...this.state}
                />
            </div>
        )
    }
}

export default App;
