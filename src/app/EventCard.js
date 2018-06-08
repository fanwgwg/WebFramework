import {Component, createElement, connect} from '../framework';
import * as timeIcon from './assets/time.png';
import * as tickIcon from './assets/tick.png';
import * as heartIcon from './assets/heart.png';
import {tags} from './Constants';
import * as Utils from './utils';

export default class EventCard extends Component {
    constructor(props) {
        super(props);
        this.onEventCardClicked = this.onEventCardClicked.bind(this);
    }

    onEventCardClicked(id) {
        this.props.onSelectEvent(id);
    }

    render() {
        let {user, title, tagId, content, image, id} = this.props.event;
        const {username, picture} = user;
        const startTime = new Date(this.props.event.startTime);
        const endTime = new Date(this.props.event.endTime);

        return (
            <div class='event-card' onclick={e => this.onEventCardClicked(id)}>
                <div class='top'>
                    <div class='user'>
                        <img src={picture} />
                        {username}
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
                <div class='bottom'>
                    <div class='option noselect'>
                        <img src={tickIcon} />
                        I am going!
                    </div>
                    <div class='option noselect'>
                        <img src={heartIcon} />
                        I like it
                    </div>
                </div>
                <div class='divider' />
            </div>
        );
    }
}
