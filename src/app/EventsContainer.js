import {Component, createElement, connect} from '../framework';
import EventCard from './EventCard';
import NoResultContainer from './NoResultContainer';
import {timeRanges, tags} from './Constants';
import * as Utils from './utils';
import * as API from './api';
import * as Actions from './action';

class EventsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    componentWillMount() {
        console.log('mount events container');
        API.getAllEvents(data => {
            this.events = data;
            this.setState({
                isLoading: false,
            });
        });
    }

    getFilteredEvents() {
        console.log('getting filtered events');
        console.log(this.props);
        const {time, fromTime, toTime, tagIds} = this.props;

        let filteredEvents = this.events.filter(e => {
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
        if (this.state.isLoading) {
            return (
                <div>
                    Loading
                </div>
            );
        }

        console.log('render events container');

        const {time, fromTime, toTime, tagIds} = this.props;
        const filteredEvents = this.getFilteredEvents();
        const isUnderSearch = fromTime || toTime || !tagIds.includes(0);
        let tagMessage;
        let timeMessage = time.description;

        if (time.description == timeRanges.LATER.description) {
            timeMessage = `from ${Utils.getFormattedDate(fromTime)} to ${Utils.getFormattedDate(toTime)}`;
        }

        if (tagIds.length > 0) {
            tagMessage = tagIds.map(t => <span class='tag'>{tags[t]}</span>);
        }

        const searchPopup = isUnderSearch ? (
            <div class='search-popup' key={0}>
                <div class='result' key={0}>
                    {filteredEvents.length} Results
                    <button onclick={this.props.clearSearchFilter.bind(this)}>Clear Filter</button>
                </div>
                <div class='description' key={1}>
                    Filtered for {tagMessage} {timeMessage.toLowerCase()}
                </div>
            </div>
        ) : <div />;

        const noResultMessage = filteredEvents.length == 0 ? <NoResultContainer key={1} /> : null;

        return (
            <div class='events-container' key={1} style={isUnderSearch ? 'top: 130px' : 'top: 50px'}>
                {searchPopup}
                {noResultMessage}
                {filteredEvents.map((event, index) => <EventCard event={event} key={index + 2} />)}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        clearSearchFilter: () => dispatch({type: Actions.CLEAR_FILTER}),
    };
};

export default connect(null, mapDispatchToProps)(EventsContainer);
