import {Component, createElement} from '../framework';
import {tags} from './Constants';
import * as detailIcon from './assets/info.png';
import * as participantsIcon from './assets/people.png';
import * as commentsIcon from './assets/comments.png';
import * as leftArrow from './assets/left-arrow.png';
import * as rightArrow from './assets/right-arrow.png';
import * as Utils from './utils';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.map = null;
    }

    componentDidMount() {
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

    render() {
        const {event, style} = this.props;
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);
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
        if (content.length > 300) {
            content = Utils.getStringWithLimit(content, 300);
            content += '...';
        }

        return (
            <div class='event-detail' style={style}>
                <div class='tag'>{tags[event.tagId]}</div>
                <div class='title'>{event.title}</div>
                <div class='user-info'>
                    <img src={event.user.picture} />
                    <div class='right'>
                        <div class='username'>{event.user.username}</div>
                        <div class='publish-time'>Published on {event.publishTime}</div>
                    </div>
                </div>
                <div class='divider' />
                <div class='tabs-container'>
                    {tabElements}
                </div>
                <div class='divider' />
                <div class='event-pics'>{images}</div>
                <p>{content}</p>
                <button class='read-more-button'>Read more</button>
                <div class='section'>
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
                <div class='section'>
                    <div class='name'>Where</div>
                    <div class='map-container' id='map-container'>
                    </div>
                </div>
                <div class='divider' />
            </div>
        );
    }
};

export default EventDetail;
