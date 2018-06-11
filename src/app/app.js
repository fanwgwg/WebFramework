import {render, Component, createElement, Route, createStore} from '../framework';
import './app.css';
import reducer from './reducer';
import SignInPage from './SignInPage';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import * as Actions from './action';
import * as API from './api';

const store = createStore(reducer);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.getState();
    }

    componentWillMount() {
        this.unsubscribe = this.props.store.subscribe(() => {
            let newState = this.props.store.getState();
            console.log(newState);
            this.setState(newState);
        });
    }

    componentDidMount() {
        let token = sessionStorage.getItem('token');
        let userid = sessionStorage.getItem('userid');
        if (token && token.length > 0 && userid) {
            API.getUserById(token, userid, data => {
                console.log(data);
                this.props.store.dispatch({
                    type: Actions.SIGN_IN_SUCCEED,
                    data: {
                        token: token,
                        user: data,
                    },
                });
            }
            );
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        console.log(this.state);
        if (this.props.store == undefined) {
            return (
                <div class='app'>
                    Loading
                </div>
            );
        }

        return (
            <div class='app'>
                <Route key={0} exact path='/' enabled={!this.state.isAuthenticated} render={() => <SignInPage />} />
                {/* <Route key={1} exact path='/events'  render={() => <EventsPage />} /> */}
                <Route key={1} path='/' enabled={this.state.isAuthenticated} render={({match}) => <HomePage match={match} />} />
                {location.pathname == '/' || location.pathname.startsWith('/events/') || location.pathname.startsWith('/profile/') ? null : <NotFoundPage />}
            </div>
        );
    }
}

render(<App store={store} />, document.getElementById('root'));
