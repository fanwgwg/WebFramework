import {Component, createElement, connect} from '../framework';
import * as timeIcon from './assets/time.png';
import * as tickIcon from './assets/tick.png';
import * as heartIcon from './assets/heart.png';
import * as tickShapeIcon from './assets/tick-purple.png';
import * as heartShapeIcon from './assets/heart-purple.png';
import {tags} from './Constants';
import * as Utils from './utils';
import * as API from './api';
import * as Actions from './action';

class EventCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            responses: [],
        };
        this.onEventCardClicked = this.onEventCardClicked.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        API.getUserById(this.props.token, this.props.event.userid, data => {
            API.getEventResponses(this.props.token, this.props.event.id, responses => {
                this.setState({
                    user: data,
                    responses: responses,
                });
            });
        });
    }

    onEventCardClicked(id) {
        if (this.props.inSearch) {
            return;
        }

        history.pushState({}, null, `/events/${id}`);
        this.props.setInDetail(true);
    }

    onGoingClicked(e) {
        if (this.props.inSearch) {
            return;
        }

        e.stopPropagation();

        const {user, responses} = this.state;
        const {event, currentUser} = this.props;

        if (!user) {
            return;
        }

        const isGoing = !responses.going.map(r => r.userid).includes(this.props.currentUser.id);
        API.goForEvent(this.props.token, currentUser.id, event.id, isGoing, () => {
            this.fetchData();

            if (this.props.onEventCardUpdate) {
                this.props.onEventCardUpdate();
            }
        });
    }

    onLikeClicked(e) {
        if (this.props.inSearch) {
            return;
        }

        e.stopPropagation();

        const {user, responses} = this.state;
        const {event, currentUser} = this.props;

        if (!user) {
            return;
        }

        const like = !responses.likes.map(r => r.userid).includes(this.props.currentUser.id);
        API.likeEvent(this.props.token, currentUser.id, event.id, like, () => {
            this.fetchData();

            if (this.props.onEventCardUpdate) {
                this.props.onEventCardUpdate();
            }
        });
    }

    onUserClicked(e) {
        e.stopPropagation();
        history.pushState({}, null, `/profile/${this.props.event.userid}`);
        this.props.setInDetail(true);
    }

    render() {
        if (this.state.responses.length == 0) {
            return <div />;
        }

        const {title, tagId, content, image, id} = this.props.event;
        const {user, responses} = this.state;
        const startTime = new Date(this.props.event.startTime);
        const endTime = new Date(this.props.event.endTime);
        const isGoing = responses.going.map(r => r.userid).includes(this.props.currentUser.id);
        const likes = responses.likes.map(r => r.userid).includes(this.props.currentUser.id);

        const interactionArea = (user && responses) ? (
            <div class='bottom'>
                <div class='option noselect' onclick={e => this.onGoingClicked(e)}>
                    <img src={isGoing ? tickIcon : tickShapeIcon} />
                    {isGoing ? 'I am going!' : `${responses.going.length} going`}
                </div>
                <div class='option noselect' onclick={e => this.onLikeClicked(e)}>
                    <img src={likes ? heartIcon : heartShapeIcon} />
                    {likes ? 'I like it' : `${responses.likes.length} likes`}
                </div>
            </div>
        ) : null;

        return (
            <div class='event-card' onclick={e => this.onEventCardClicked(id)}>
                <div class='top'>
                    <div class='user'>
                        <img src={user ? user.picture : undefined} onclick={e => this.onUserClicked(e)}/>
                        {user ? user.username : ''}
                    </div>
                    <div class='tag noselect'>{tags[tagId]}</div>
                </div>
                <div class='middle'>
                    <div class='info'>
                        <div class='title'>{title}</div>
                        <div class='time'>
                            <img src={timeIcon} />
                            {Utils.getDateString(startTime)} to {Utils.getDateString(endTime)}
                        </div>
                    </div>
                    {image.length > 0 ? <img src={image[0]} /> : null}
                </div>
                <p>{Utils.getStringWithLimit(content, 300)}</p>
                {interactionArea}
                <div class='divider' />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        inSearch: state.inSearch,
        token: state.token,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setInDetail: data => dispatch({type: Actions.SET_IN_DETAIL, data}),
        selectEvent: () => dispatch({type: Actions.SELECT_EVENT}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventCard);
