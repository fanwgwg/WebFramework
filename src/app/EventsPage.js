import {Component, createElement} from '../framework';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import * as searchIcon from './assets/search.png';
import * as profileIcon from './assets/profile.png';
import {events} from './Constants';

export default class EventsPage extends Component {
    constructor() {
        super();
        this.state = {
            inSearch: true,
        };
    }

    onSearchIconClicked() {
        this.setState({
            inSearch: !this.state.inSearch,
        });
    }

    render() {
        const eventCards = events.map(event => <EventCard event={event} />);
        return (
            <div class='page events-page' style={this.state.inSearch ? 'transform: translate3d(75%, 0, 0)' : ''}>
                <div class='sidebar' >
                    <SearchBar />
                </div>
                <div class='main' >
                    <div class='top-menu'>
                        <img src={searchIcon} alt='Search' style='width: 24px' onclick={this.onSearchIconClicked.bind(this)} />
                        <span>BlackCat</span>
                        <img src={profileIcon} alt='Profile' />
                    </div>
                    <div class='events-container'>
                        {eventCards}
                    </div>
                </div>
            </div>
        );
    }
}
