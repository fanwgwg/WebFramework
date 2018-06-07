import {Component, createElement} from './index';

let globalStore;

const validateAction = action => {
    if (!action || typeof action !== 'object' || Array.isArray(action)) {
        console.error('Action must be an object');
    }

    if (typeof action.type === 'undefined') {
        console.error('Action must have a type');
    }
};

export const createStore = reducer => {
    let state;
    const subscribers = [];

    const store = {
        dispatch: action => {
            validateAction(action);
            state = reducer(state, action);
            subscribers.forEach(handler => handler());
        },
        getState: () => state,
        subscribe: handler => {
            subscribers.push(handler);
            return () => {
                const index = subscribers.indexOf(handler);
                if (index > 0) {
                    subscribers.splice(index, 1);
                }
            };
        },
    };

    store.dispatch({type: '@@store/INIT'});
    globalStore = store;
    return store;
};

export const connect = (mapStateToProps, mapDispatchToProps) => {
    return WrappedComponent => {
        return class extends Component {
            constructor() {
                super();
                this.state = {storeState: globalStore.getState()};
            }

            componentDidMount() {
                this.unsubscribe = globalStore.subscribe(this.handleChange.bind(this));
            }

            componentWillUnmount() {
                this.unsubscribe();
            }

            handleChange() {
                this.forceUpdate();
            }

            render() {
                let stateProps;
                let dispatchProps;

                if (mapStateToProps) {
                    stateProps = mapStateToProps(globalStore.getState(), this.props);
                }

                if (mapDispatchToProps) {
                    dispatchProps = mapDispatchToProps(globalStore.dispatch, this.props);
                }

                console.log(this.props);

                return (
                    <WrappedComponent
                        {...this.props}
                        {...stateProps}
                        {...dispatchProps}
                    />
                );
            }
        };
    };
};
