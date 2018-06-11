import {Component, createElement, connect} from '../framework';
import {tags} from './Constants';
import MapWrapper from './MapWrapper';
import Comments from './Comments';
import * as detailIcon from './assets/info.png';
import * as detailGreenIcon from './assets/info-green.png';
import * as participantsIcon from './assets/people.png';
import * as participantsGreenIcon from './assets/people-green.png';
import * as commentsIcon from './assets/comments.png';
import * as commentsGreenIcon from './assets/comments-green.png';
import * as heartIcon from './assets/heart-gray.png';
import * as leftArrow from './assets/left-arrow.png';
import * as rightArrow from './assets/right-arrow.png';
import * as penGreenIcon from './assets/pen-green.png';
import * as heartGreenIcon from './assets/heart-green.png';
import * as tickGreenIcon from './assets/tick-green.png';
import * as heartPurpleIcon from './assets/heart-purple.png';
import * as tickPurpleIcon from './assets/tick-purple.png';
import * as postCommentIcon from './assets/post-comment.png';
import * as closeIcon from './assets/close.png';
import * as Utils from './utils';
import * as API from './api';
import * as Actions from './action';

const tabsInfo = [
    {
        text: 'Details',
        icon: detailIcon,
        activeIcon: detailGreenIcon,
        tag: 'details-divider',
    },
    {
        text: 'Participants',
        icon: participantsIcon,
        activeIcon: participantsGreenIcon,
        tag: 'participants-divider',
    },
    {
        text: 'Comments',
        icon: commentsIcon,
        activeIcon: commentsGreenIcon,
        tag: 'comments-divider',
    },
];

class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            activeTab: 0,
            showAllContent: false,
            isCommenting: false,
            replyingTo: null,
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        if (!this.props.inDetail) {
            this.props.setInDetail(true);
        }
    }

    fetchData() {
        API.getEventById(this.props.token, this.props.eventId, eventData => {
            this.event = eventData.event;
            this.responses = eventData.responses;
            API.getUserById(this.props.token, eventData.event.userid, userInfo => {
                this.user = userInfo;
                this.setState({
                    isLoading: false,
                });
            });
        });
    }

    onGoingClicked() {
        if (!this.user) {
            return;
        }

        const isGoing = !this.responses.going.map(r => r.userid).includes(this.props.currentUser.id);
        API.goForEvent(this.props.token, this.props.currentUser.id, this.event.id, isGoing, () => {
            this.fetchData();
        });
    }

    onLikeClicked() {
        if (!this.user) {
            return;
        }

        const like = !this.responses.likes.map(r => r.userid).includes(this.props.currentUser.id);
        API.likeEvent(this.props.token, this.props.currentUser.id, this.event.id, like, () => {
            this.fetchData();
        });
    }

    onReadMoreClicked() {
        this.setState({
            showAllContent: !this.state.showAllContent,
        });
    }

    onCommentClicked() {
        this.setState({
            isCommenting: true,
        });
    }

    onCloseCommentClicked() {
        this.setState({
            isCommenting: false,
            replyingTo: null,
        });
    }

    onSendCommentClicked() {
        let text = this.commentInput.value.trim();

        if (!text || text.length == 0) {
            return;
        }

        let comment = this.formComment(text.trim());
        API.commentToEvent(this.props.token, this.event, comment, () => {
            this.setState({
                isCommenting: false,
                replyingTo: null,
            });
        });
    }

    onReplyCommentClicked(user) {
        this.setState({
            isCommenting: true,
            replyingTo: user,
        });
    }

    onTabClicked(tab) {
        location.hash = tabsInfo[tab].tag;
        this.setState({
            activeTab: tab,
        });
    }

    onUserClicked(id) {
        history.pushState({}, null, `/profile/${id}`);
        this.props.setInDetail(true);
    }

    formComment(content) {
        return {
            from: {
                userid: this.props.currentUser.id,
                username: this.props.currentUser.username,
                picture: this.props.currentUser.picture,
            },
            replyTo: this.state.replyingTo,
            content: content,
            time: new Date().toISOString(),
        };
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    Loading
                </div>
            );
        }

        const {showAllContent, isCommenting, replyingTo, activeTab} = this.state;
        const startTime = new Date(this.event.startTime);
        const endTime = new Date(this.event.endTime);
        let {content} = this.event;

        const tabElements = tabsInfo.map((info, index) => (
            <div
                key={index}
                class='tab'
                style={index == activeTab ? 'color: #AECB4F' : ''}
                onclick={() => this.onTabClicked(index)}
            >
                <img src={index == activeTab ? info.activeIcon : info.icon} />
                <span>{info.text}</span>
            </div>
        ));

        const images = this.event.image.map((i, index) => (
            <img src={i} key={index} />
        ));

        let readmoreButton = null;
        if (content.length > 300) {
            readmoreButton = (
                <button key={7} class='read-more-button' onclick={this.onReadMoreClicked.bind(this)}>
                    {showAllContent ? 'Show less' : 'Read more'}
                </button>
            );
        }

        if (!showAllContent && content.length > 300) {
            content = Utils.getStringWithLimit(content, 300);
        }

        const eventPics = this.event.image ? <div class='event-pics'>{images}</div> : null;
        const isGoing = this.responses.going.map(r => r.userid).includes(this.props.currentUser.id);
        const like = this.responses.likes.map(r => r.userid).includes(this.props.currentUser.id);
        const shouldShowComment = this.event.comments && this.event.comments.length > 0;

        const actionBar = isCommenting ? null : (
            <div class='action-bar bottom-bar'>
                <button onclick={this.onCommentClicked.bind(this)}>
                    <img src={penGreenIcon} />
                    Comment
            </button>
                <button
                    onclick={this.onLikeClicked.bind(this)}
                    style={like ? 'background: #D5EF7F; color: #8560A9' : null}>
                    <img src={like ? heartPurpleIcon : heartGreenIcon} />
                    Like
            </button>
                <button
                    onclick={this.onGoingClicked.bind(this)}
                    style={isGoing ? 'background: #D5EF7F; color: #8560A9' : null}>
                    <img src={isGoing ? tickPurpleIcon : tickGreenIcon} />
                    Going
            </button>
            </div>
        );

        const commentBar = isCommenting ? (
            <div class='comment-bar bottom-bar'>
                <button onclick={this.onCloseCommentClicked.bind(this)}>
                    <img src={closeIcon} alt='Close' class='small' />
                </button>
                <input
                    type='text'
                    ref={commentInput => this.commentInput = commentInput}
                    placeholder={replyingTo ? `@${replyingTo.username}` : 'Leave your comment here'} />
                <button onclick={this.onSendCommentClicked.bind(this)}>
                    <img src={postCommentIcon} alt='Send' class='big' />
                </button>
            </div>
        ) : null;

        return (
            <div class='event-detail' id='detail-divider'>
                <div class='tag' key={0}>{tags[this.event.tagId]}</div>
                <div class='title' key={1}>{this.event.title}</div>
                <div class='user-info' key={2}>
                    <img src={this.user.picture} onclick={() => this.onUserClicked(this.user.id)} />
                    <div class='right'>
                        <div class='username' onclick={() => this.onUserClicked(this.user.id)}>{this.user.username}</div>
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
                {readmoreButton}
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
                <div class='divider' key={10} id='participants-divider' />
                <div class='responses'>
                    <div class='section'>
                        <div class='info'>
                            <img src={heartIcon} />
                            {this.responses.going.length > 0 ? this.responses.going.length : '0'} going
                        </div>
                        <div class='users'>
                            {this.responses.going.map(user => <img src={user.picture} onclick={() => this.onUserClicked(user.userid)}/>)}
                        </div>
                    </div>
                    <div class='section'>
                        <div class='info'>
                            <img src={heartIcon} />
                            {this.responses.likes.length > 0 ? this.responses.going.length : '0'} likes
                        </div>
                        <div class='users'>
                            {this.responses.likes.map(user => <img src={user.picture} onclick={() => this.onUserClicked(user.userid)}/>)}
                        </div>
                    </div>
                </div>
                {shouldShowComment ? <div class='divider' id='comments-divider' /> : null}
                {shouldShowComment ?
                    <Comments
                        event={this.event}
                        onReplyCommentClicked={this.onReplyCommentClicked.bind(this)}
                    /> : null
                }
                {actionBar}
                {commentBar}
            </div >
        );
    }
};

const mapStateToProps = state => {
    return {
        token: state.token,
        currentUser: state.currentUser,
        inDetail: state.inDetail,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setInDetail: data => dispatch({type: Actions.SET_DETAIL, data}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail);
