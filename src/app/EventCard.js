import {Component, createElement} from '../framework';
import * as timeIcon from './assets/time.png';

export default class EventCard extends Component {
    render() {
        let {user, title, tag, content, startTime, endTime, image} = this.props.event;
        const {username, picture} = user;

        return (
            <div class='event-card'>
                <div class='top'>
                    <div class='user'>
                        <img src={picture} />
                        {username}
                    </div>
                    <div class='tag'>{tag}</div>
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
            </div>
        );
    }
}
