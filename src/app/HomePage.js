import {Component, createElement, connect, Route} from '../framework';
import SearchBar from './SearchBar';
import EventDetail from './EventDetail';
import EventContainer from './EventsContainer';
import ProfileContainer from './ProfileContainer';
import NotFoundPage from './NotFoundPage';
import * as searchIcon from './assets/search.png';
import * as homeIcon from './assets/home.png';
import * as Utils from './utils';
import * as Actions from './action';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inSearch: this.props.inSearch,
            inDetail: false,
        };
    }

    onMenuIconClicked() {
        const {inSearch, inDetail} = this.state;

        if (inDetail || this.props.inDetail) {
            history.pushState({}, null, `/`);
            this.props.setDetail(false),
            this.setState({
                inDetail: false,
            });
            return;
        } else if (!inSearch) {
            Utils.disableScroll();
            this.props.setSearch(true);
            this.setState({
                inSearch: true,
            });
        }
    }

    onSearchStarted() {
        Utils.enableScroll();
        this.props.setSearch(false);
        this.setState({
            inSearch: false,
        });
    }

    onUserClicked(id) {
        history.pushState({}, null, `/profile/${id}`);
        this.props.setDetail(true);
        this.setState({
            inDetail: true,
        });
    }

    render() {
        console.log('render home page');
        const {time, fromTime, toTime, tagIds, currentUser} = this.props;
        const {inSearch, inDetail} = this.state;

        return (
            <div class='page home-page' style={inSearch ? '-webkit-transform: translate3d(75%, 0, 0)' : ''}>
                <div class='sidebar' key={0}>
                    {inSearch ? <SearchBar onSearchStarted={this.onSearchStarted.bind(this)} /> : null}
                </div>
                <div class='main' key={1} style={inSearch ? 'opacity: 0.5; background: #b7b7b7' : 'null'}>
                    <div class='top-menu' key={0}>
                        <img
                            src={this.props.inDetail ? homeIcon : searchIcon}
                            alt={inDetail ? 'Home' : 'Search'}
                            style='width: 24px'
                            onclick={this.onMenuIconClicked.bind(this)}
                        />
                        <span>BlackCat</span>
                        <img src={currentUser.picture} alt='Profile' onclick={() => this.onUserClicked(currentUser.id)} />
                    </div>
                    <Route key={1} exact path='/' enabled render={() => (
                        <EventContainer
                            time={time}
                            fromTime={fromTime}
                            toTime={toTime}
                            tagIds={tagIds}
                        />
                    )} />
                    <Route key={2} exact path='/events/:id' enabled render={({match}) => (
                        <EventDetail eventId={parseInt(match.params[0])} />
                    )} />
                    <Route key={3} exact path='/profile/:userid' enabled render={({match}) => (
                        <ProfileContainer userid={parseInt(match.params[0])} />
                    )} />
                    {location.pathname == '/' || location.pathname.startsWith('/events/') || location.pathname.startsWith('/profile/') ? null : <NotFoundPage /> }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        time: state.searchTimeFilter ? state.searchTimeFilter : null,
        fromTime: state.searchTimeFilter ? state.searchTimeFilter.fromTime : null,
        toTime: state.searchTimeFilter ? state.searchTimeFilter.toTime : null,
        tagIds: state.searchTagFilter ? state.searchTagFilter : [0],
        inDetail: state.inDetail,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setSearch: data => dispatch({type: Actions.SET_SEARCH, data}),
        setDetail: data => dispatch({type: Actions.SET_IN_DETAIL, data}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
