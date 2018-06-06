import {render, Component, createElement, Route, createStore} from '../framework';
import './app.css';
import reducer from './reducer';
import SignInPage from './SignInPage';
import EventsPage from './EventsPage';

const store = createStore(reducer);

class App extends Component {
    componentWillMount() {
        this.unsubscribe = this.props.store.subscribe(() => {
            let newState = this.props.store.getState();
            console.log(newState);
            this.setState(newState);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        console.log(`render App with state ${this.state.isAuthenticated}`);
        console.log(this.props.store === this.state.isAuthenticated);
        if (this.props.store == undefined) {
            return (
                <div class='app'>
                Loading
                </div>
            );
        }

        return (
            <div class='app'>
                <Route key={0} exact path='/' enabled render={() => <SignInPage />} />
                {/* <Route key={1} exact path='/events' enabled={this.state.isAuthenticated} render={() => <EventsPage />} /> */}
                <Route key={1} exact path='/events' enabled render={() => <EventsPage />} />
            </div>
        );
    }
}

render(<App store={store} />, document.getElementById('root'));
