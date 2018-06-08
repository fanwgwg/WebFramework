import {Component, createElement} from '../framework';
import EventCard from './EventCard';
import {timeRanges, tags} from './Constants';
import * as Utils from './utils';
import * as activityIcon from './assets/activity.png';

export default class EventsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    componentWillMount() {
        this.events = [];
        fetch('http://localhost:3000/events')
            .then(response => {
                return response.json();
            }).then(json => {
                console.log(json);
                this.events = json;
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

        const {time, fromTime, toTime, tagIds} = this.props;
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
            <div class='search-popup' key={1}>
                <div class='result' key={0}>
                    {filteredEvents.length} Results
                    <button onclick={this.props.onClearSearch.bind(this)}>Clear Filter</button>
                </div>
                <div class='description' key={1}>
                    Filtered for {tagMessage} {timeMessage.toLowerCase()}
                </div>
            </div>
        ) : null;

        const noResultMessage = filteredEvents.length == 0 ? (
            <div class='message'>
                <img src={activityIcon} />
                No event found
            </div>
        ) : null;

        return (
            <div class='events-container' key={1} style={searchPopup ? 'top: 130px' : 'top: 50px'}>
                {searchPopup}
                {noResultMessage}
                {filteredEvents.map((event, index) =>
                    <EventCard
                        event={event}
                        onSelectEvent={() => this.props.onSelectEvent(event.id)}
                        key={index}
                    />)}
            </div>
        );
    }
}
