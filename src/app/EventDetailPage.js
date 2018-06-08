import {Component, createElement} from '../framework';
import {tags} from './Constants';
import MapWrapper from './MapWrapper';
import * as detailIcon from './assets/info.png';
import * as participantsIcon from './assets/people.png';
import * as commentsIcon from './assets/comments.png';
import * as leftArrow from './assets/left-arrow.png';
import * as rightArrow from './assets/right-arrow.png';
import * as Utils from './utils';

const tabsInfo = [
    {
        text: 'Details',
        icon: detailIcon,
    },
    {
        text: 'Participants',
        icon: participantsIcon,
    },
    {
        text: 'Comments',
        icon: commentsIcon,
    },
];

class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAllContent: false,
        };
    }

    componentDidMount() {
        this.props.onEnterDetail();
    }

    addMap() {
        const {lnglat, description} = this.props.event.location;
        mapboxgl.accessToken = 'pk.eyJ1IjoibGFoYWxhaGEiLCJhIjoiY2ppMm92aWk0MDBlMDNxbzRtaGY2aDhjaCJ9.GXYAQLGcDdLFuFs0-5l9Bw';
        this.map = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v10',
            center: lnglat,
            zoom: 16,
        });

        let markerElement = <div class='map-marker' />;
        new mapboxgl.Marker(markerElement)
            .setLngLat(lnglat)
            .setPopup(new mapboxgl.Popup({offset: 10}).setHTML(description))
            .addTo(this.map);
    }

    onReadMoreClicked() {
        this.setState({
            showAllContent: !this.state.showAllContent,
        });
    }

    render() {
        const {event, style} = this.props;
        const {showAllContent} = this.state;
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        const tabElements = tabsInfo.map((info, index) => (
            <div key={index} class='tab'>
                <img src={info.icon} />
                <span>{info.text}</span>
            </div>
        ));
        const images = event.image.map((i, index) => (
            <img src={i} key={index} />
        ));
        let {content} = event;
        if (!showAllContent && content.length > 300) {
            content = Utils.getStringWithLimit(content, 300);
        }

        const eventPics = event.image ? <div class='event-pics'>{images}</div> : null;

        return (
            <div class='event-detail' style={style}>
                <div class='tag' key={0}>{tags[event.tagId]}</div>
                <div class='title' key={1}>{event.title}</div>
                <div class='user-info' key={2}>
                    <img src={event.user.picture} />
                    <div class='right'>
                        <div class='username'>{event.user.username}</div>
                        <div class='publish-time'>Published on {event.publishTime}</div>
                    </div>
                </div>
                <div class='divider' key={3} />
                <div class='tabs-container' key={4}>
                    {tabElements}
                </div>
                <div class='divider' key={5} />
                {eventPics}
                <p key={6}>{content}</p>
                <button key={7} class='read-more-button' onclick={this.onReadMoreClicked.bind(this)}>
                    {showAllContent ? 'Show less' : 'Read more'}
                </button>
                <div class='section' key={8}>
                    <div class='name'>When</div>
                    <div class='time-container'>
                        <div class='time-block'>
                            <div class='top'>
                                <img src={rightArrow} />
                                {Utils.getDateString(startTime)}
                            </div>
                            <div class='bottom'>
                                {Utils.getTimeString(startTime).time}
                                <span>{Utils.getTimeString(startTime).period}</span>
                            </div>
                        </div>
                        <div class='vertical-divider' />
                        <div class='time-block'>
                            <div class='top'>
                                <img src={leftArrow} />
                                {Utils.getDateString(endTime)}
                            </div>
                            <div class='bottom'>
                                {Utils.getTimeString(endTime).time}
                                <span>{Utils.getTimeString(endTime).period}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='section' key={9}>
                    <div class='name'>Where</div>
                    <MapWrapper lnglat={event.location.lnglat} description={event.location.description} />
                </div>
                <div class='divider' key={10} />
            </div >
        );
    }
};

export default EventDetail;
