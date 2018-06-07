import {Component, createElement, connect} from '../framework';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import * as searchIcon from './assets/search.png';
import * as profileIcon from './assets/profile.png';
import {events, timeRanges, tags} from './Constants';
import * as Utils from './utils';
import * as Actions from './action';

class EventsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inSearch: false,
        };
    }

    onSearchIconClicked() {
        Utils.disableScroll();
        this.setState({
            inSearch: true,
        });
    }

    onSearchStarted() {
        Utils.enableScroll();
        this.setState({
            inSearch: false,
        });
    }

    onClearSearch() {
        console.log('clear search');
        this.props.clearSearchFilter();
    }

    getFilteredEvents() {
        const {time, fromTime, toTime, tagIds} = this.props;

        let filteredEvents = events.filter(e => {
            if (time.description == timeRanges.ANYTIME.description) {
                return true;
            }

            let filterFrom = fromTime ? fromTime : time.fromTime;
            let filterTo = toTime ? toTime : time.toTime;
            let eventFrom = new Date(e.startTime);
            let eventTo = new Date(e.endTime);

            return Utils.hasOverlap(filterFrom, filterTo, eventFrom, eventTo);
        }).filter(e => tagIds.includes(0) || tagIds.includes(e.tagId));

        return filteredEvents;
    }

    render() {
        const {time, fromTime, toTime, tagIds} = this.props;
        const {inSearch} = this.state;
        const filteredEvents = this.getFilteredEvents();

        let tagMessage;
        let timeMessage = time.description;
        if (time.description == timeRanges.LATER.description) {
            timeMessage = `from ${Utils.getFormattedDate(fromTime)} to ${Utils.getFormattedDate(toTime)}`;
        }
        if (tagIds.length > 0) {
            tagMessage = tagIds.map(t => <span class='tag'>{tags[t]}</span>);
        }

        const searchPopup = fromTime || toTime || !tagIds.includes(0) ? (
            <div class='search-popup' key={2}>
                <div class='result' key={0}>
                    {filteredEvents.length} Results
                    <button onclick={this.onClearSearch.bind(this)}>Clear Filter</button>
                </div>
                <div class='description' key={1}>
                    Filtered for {tagMessage} {timeMessage.toLowerCase()}
                </div>
            </div>
        ) : null;

        const eventCards = filteredEvents.map((event, index) => <EventCard event={event} key={index} />);
        return (
            <div class='page events-page' style={this.state.inSearch ? '-webkit-transform: translate3d(75%, 0, 0)' : ''}>
                <div class='sidebar' key={0}>
                    {inSearch ? <SearchBar onSearchStarted={this.onSearchStarted.bind(this)} /> : null}
                </div>
                <div class='main' key={1} style={inSearch ? 'opacity: 0.5; background: #b7b7b7' : 'null'}>
                    <div class='top-menu' key={0}>
                        <img src={searchIcon} alt='Search' style='width: 24px' onclick={this.onSearchIconClicked.bind(this)} />
                        <span>BlackCat</span>
                        <img src={profileIcon} alt='Profile' />
                    </div>
                    {searchPopup}
                    <div class='events-container' key={1} style={searchPopup ? 'top: 130px' : 'top: 50px'}>
                        {eventCards}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        eventspage: true,
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
