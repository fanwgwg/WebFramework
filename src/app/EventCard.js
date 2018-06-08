import {Component, createElement, connect} from '../framework';
import * as timeIcon from './assets/time.png';
import * as tickIcon from './assets/tick.png';
import * as heartIcon from './assets/heart.png';
import * as tickShapeIcon from './assets/tick-shape.png';
import * as heartShapeIcon from './assets/heart-shape.png';
import {tags} from './Constants';
import * as Utils from './utils';
import * as API from './api';

export default class EventCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            responses: [],
        };
        this.onEventCardClicked = this.onEventCardClicked.bind(this);
    }

    componentWillMount() {
        API.getUserById(this.props.event.userid, data => {
            API.getEventResponses(this.props.event.id, responses => {
                this.setState({
                    user: data,
                    responses: responses,
                });
            });
        });
    }

    onEventCardClicked(id) {
        this.props.onSelectEvent(id);
    }

    onGoingClicked(e) {
        e.stopPropagation();

        const {user} = this.state;
        const {event} = this.props;

        if (!user) {
            return;
        }

        const isGoing = user.going.includes(event.id);
        API.goForEvent(user.id, event.id, isGoing, () => {
            this.forceUpdate();
        });
    }

    onLikeClicked(e) {
        e.stopPropagation();

        const {user} = this.state;
        const {event} = this.props;

        if (!user) {
            return;
        }

        const like = user.likes.includes(event.id);
        API.likeEvent(user.id, event.id, like, () => {
            this.forceUpdate();
        });
    }

    render() {
        const {title, tagId, content, image, id} = this.props.event;
        const {user, responses} = this.state;
        const startTime = new Date(this.props.event.startTime);
        const endTime = new Date(this.props.event.endTime);
        const isGoing = user ? user.going.includes(id) : false;
        const likes = user ? user.likes.includes(id) : false;

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
                        <img src={user ? user.picture : undefined} />
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
