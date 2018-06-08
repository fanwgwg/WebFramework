import {Component, createElement, connect, Route} from '../framework';
import SearchBar from './SearchBar';
import EventDetail from './EventDetailPage';
import EventContainer from './EventsContainer';
import * as searchIcon from './assets/search.png';
import * as homeIcon from './assets/home.png';
import * as Utils from './utils';
import * as Actions from './action';

class EventsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inSearch: false,
            inDetail: false,
        };
    }

    onMenuIconClicked() {
        const {inSearch, inDetail} = this.state;

        if (inDetail) {
            history.pushState({}, null, `/events`);
            this.setState({
                inDetail: false,
            });
            return;
        } else if (!inSearch) {
            Utils.disableScroll();
            this.setState({
                inSearch: true,
            });
        }
    }

    onSearchStarted() {
        Utils.enableScroll();
        this.setState({
            inSearch: false,
        });
    }

    onClearSearch() {
        this.props.clearSearchFilter();
    }

    onSelectEvent(id) {
        history.pushState({}, null, `/events/${id}`);
        this.setState({
            inDetail: true,
        });
    }

    onEnterDetail() {
        if (!this.state.inDetail) {
            this.setState({
                inDetail: true,
            });
        }
    }

    render() {
        const {time, fromTime, toTime, tagIds, currentUser} = this.props;
        const {inSearch, inDetail} = this.state;

        return (
            <div class='page events-page' style={inSearch ? '-webkit-transform: translate3d(75%, 0, 0)' : ''}>
                <div class='sidebar' key={0}>
                    {inSearch ? <SearchBar onSearchStarted={this.onSearchStarted.bind(this)} /> : null}
                </div>
                <div class='main' key={1} style={inSearch ? 'opacity: 0.5; background: #b7b7b7' : 'null'}>
                    <div class='top-menu' key={0}>
                        <img
                            src={inDetail ? homeIcon : searchIcon}
                            alt={inDetail ? 'Home' : 'Search'}
                            style='width: 24px'
                            onclick={this.onMenuIconClicked.bind(this)}
                        />
                        <span>BlackCat</span>
                        <img src={currentUser.picture} alt='Profile' />
                    </div>
                    <Route key={2} exact path='/events' enabled render={() => (
                        <EventContainer
                            currentUser={this.props.currentUser}
                            time={time}
                            fromTime={fromTime}
                            toTime={toTime}
                            tagIds={tagIds}
                            onClearSearch={this.onClearSearch.bind(this)}
                            onSelectEvent={this.onSelectEvent.bind(this)}
                        />
                    )} />
                    <Route key={3} exact path='/events/:id' enabled render={({match}) => (
                        <EventDetail
                            currentUser={this.props.currentUser}
                            eventId={parseInt(match.params[0])}
                            style='top: 50px'
                            onEnterDetail={this.onEnterDetail.bind(this)}
                        />
                    )} />
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearSearchFilter: () => dispatch({type: Actions.CLEAR_FILTER}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
