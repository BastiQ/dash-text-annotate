import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextAnnotator} from 'react-text-annotate'

/**
 * Learnings:
 * Don't try to print (<p>..</p>) lists or dictionaries directly
 */
export default class DashTextAnnotate extends Component {

    /**constructor(props) {
        super(props);
        this.state = {
          tag: 'DATE' // this state is tracked in App state (this.props.tag)
        }
    }*/

    render() { 
        const {id, setProps, text, entities, tag, tag_colors} = this.props;
        //console.log(entities)
        //console.log(tag)
        //console.log(tag_colors[tag])

        return (
            <div id={id}>
                <TextAnnotator
                    style={{
                        lineHeight: 1.5,
                    }}
                    content={text}
                    value={entities}
                    onChange={value => setProps({entities: value})}
                    getSpan={span => ({
                        ...span,
                        tag: tag,
                        color: tag_colors[tag],
                    })}
                />
            </div>
        );
    }
}

DashTextAnnotate.defaultProps = {};

// Possible PropTypes: https://reactjs.org/docs/typechecking-with-proptypes.html
DashTextAnnotate.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    /**
     * The text that should be annotated
     */
    text: PropTypes.string.isRequired,

    /**
     * The entities that are currently available
     */
    entities: PropTypes.array,

    /**
     * The currently selected tag (e.g. DATE) with which the selections will be tagged. This must be managed by the Dash App.
     */
     tag: PropTypes.string.isRequired,

    /**
     * The currently selected tag color (e.g. GREEN) with which the selected tag will be colored. This must be managed by the Dash App.
     */
    tag_colors: PropTypes.object.isRequired,
};
