import {render, Component, createElement, Route, createStore} from '../framework';
import './app.css';
import reducer from './reducer';
import SignInPage from './SignInPage';
import EventsPage from './EventsPage';

const store = createStore(reducer);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.getState();
    }

    componentWillMount() {
        if (Object.keys(this.state).length == 0) {
            this.props.store.init();
            return;
        }

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
                <Route key={0} exact path='/'enabled={!this.state.isAuthenticated} render={() => <SignInPage />} />
                {/* <Route key={1} exact path='/events'  render={() => <EventsPage />} /> */}
                <Route key={1} path='/' enabled={this.state.isAuthenticated} render={({match}) => <EventsPage match={match}/>} />
            </div>
        );
    }
}

render(<App store={store} />, document.getElementById('root'));
