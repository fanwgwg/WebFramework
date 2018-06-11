import {Component, createElement, connect} from '../framework';
import * as blackcat from './assets/blackcat.png';
import * as Actions from './action';

class NotFoundPage extends Component {
    onHomeClicked() {
        history.pushState({}, null, `/`);
        this.props.updateRoute();
    }

    render() {
        return (
            <div class='page not-found-page'>
                <img src={blackcat} />
                <button onclick={this.onHomeClicked.bind(this)}>Back To Home</button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateRoute: () => dispatch({type: Actions.UPDATE_ROUTE}),
    };
};

export default connect(null, mapDispatchToProps)(NotFoundPage);


