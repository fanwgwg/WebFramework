import {Component, createElement, connect} from '../framework';
import {tags} from './Constants';
import MapWrapper from './MapWrapper';
import Comments from './Comments';
import * as detailIcon from './assets/info.png';
import * as participantsIcon from './assets/people.png';
import * as commentsIcon from './assets/comments.png';
import * as heartIcon from './assets/heart-gray.png';
import * as leftArrow from './assets/left-arrow.png';
import * as rightArrow from './assets/right-arrow.png';
import * as penGreenIcon from './assets/pen-green.png';
import * as heartGreenIcon from './assets/heart-green.png';
import * as tickGreenIcon from './assets/tick-green.png';
import * as heartPurpleIcon from './assets/heart-purple.png';
import * as tickPurpleIcon from './assets/tick-purple.png';
import * as Utils from './utils';
import * as API from './api';

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

export default class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showAllContent: false,
        };
    }

    componentWillMount() {
        API.getEventById(this.props.eventId, eventData => {
            this.event = eventData.event;
            this.responses = eventData.responses;
            API.getUserById(eventData.event.userid, userInfo => {
                this.user = userInfo;
                this.setState({
                    isLoading: false,
                });
            });
        });
    }

    componentDidMount() {
        this.props.onEnterDetail();
    }

    onGoingClicked() {
        if (!this.user) {
            return;
        }

        const isGoing = this.responses.going.map(r => r.userid).includes(this.props.currentUser.id);
        API.goForEvent(this.props.currentUser.id, this.event.id, isGoing, () => {
            this.fetchData();
        });
    }

    onLikeClicked() {
        if (!this.user) {
            return;
        }

        const like = this.responses.likes.map(r => r.userid).includes(this.props.currentUser.id);
        API.likeEvent(this.props.currentUser.id, this.event.id, like, () => {
            this.fetchData();
        });
    }

    onReadMoreClicked() {
        this.setState({
            showAllContent: !this.state.showAllContent,
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    Loading
                </div>
            );
        }

        const {style} = this.props;
        const {showAllContent} = this.state;
        const startTime = new Date(this.event.startTime);
        const endTime = new Date(this.event.endTime);
        let {content} = this.event;

        const tabElements = tabsInfo.map((info, index) => (
            <div key={index} class='tab'>
                <img src={info.icon} />
                <span>{info.text}</span>
            </div>
        ));

        const images = this.event.image.map((i, index) => (
            <img src={i} key={index} />
        ));


        if (!showAllContent && content.length > 300) {
            content = Utils.getStringWithLimit(content, 300);
        }

        const eventPics = this.event.image ? <div class='event-pics'>{images}</div> : null;
        const isGoing = this.responses.going.map(r => r.userid).includes(this.props.currentUser.id);
        const like = this.responses.likes.map(r => r.userid).includes(this.props.currentUser.id);
        const shouldShowComment = this.event.comments && this.event.comments.length > 0;

        return (
            <div class='event-detail' style={style}>
                <div class='tag' key={0}>{tags[this.event.tagId]}</div>
                <div class='title' key={1}>{this.event.title}</div>
                <div class='user-info' key={2}>
                    <img src={this.user.picture} />
                    <div class='right'>
                        <div class='username'>{this.user.username}</div>
                        <div class='publish-time'>Published on {this.event.publishTime}</div>
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
                    <MapWrapper lnglat={this.event.location.lnglat} description={this.event.location.description} />
                </div>
                <div class='divider' key={10} />
                <div class='responses'>
                    <div class='section'>
                        <div class='info'>
                            <img src={heartIcon} />
                            {this.responses.going.length} going
                        </div>
                        <div class='users'>
                            {this.responses.going.map(user => <img src={user.picture} />)}
                        </div>
                    </div>
                    <div class='section'>
                        <div class='info'>
                            <img src={heartIcon} />
                            {this.responses.likes.length} likes
                        </div>
                        <div class='users'>
                            {this.responses.likes.map(user => <img src={user.picture} />)}
                        </div>
                    </div>
                </div>
                {shouldShowComment ? <div class='divider' /> : null}
                {shouldShowComment ? <Comments event={this.event} /> : null}
                <div class='action-bar'>
                    <button>
                        <img src={penGreenIcon} />
                        Comment
                    </button>
                    <button style={like ? 'background: #D5EF7F; color: #8560A9' : null}>
                        <img src={like ? heartPurpleIcon : heartGreenIcon} />
                        Like
                    </button>
                    <button style={isGoing ? 'background: #D5EF7F; color: #8560A9' : null}>
                        <img src={isGoing? tickPurpleIcon : tickGreenIcon} />
                        Going
                    </button>
                </div>
            </div >
        );
    }
};
