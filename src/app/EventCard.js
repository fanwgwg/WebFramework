import {Component, createElement} from '../framework';
import * as timeIcon from './assets/time.png';
import * as tickIcon from './assets/tick.png';
import * as heartIcon from './assets/heart.png';
import {tags} from './Constants';

export default class EventCard extends Component {
    render() {
        let {user, title, tagId, content, startTime, endTime, image} = this.props.event;
        const {username, picture} = user;

        return (
            <div class='event-card'>
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
                            {startTime} to {endTime}
                        </div>
                    </div>
                    {image ? <img src={image} /> : null}
                </div>
                <p>{content}</p>
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
