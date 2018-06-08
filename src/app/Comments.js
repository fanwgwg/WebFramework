import {Component, createElement} from '../framework';
import * as Utils from './utils';
import * as replyIcon from './assets/reply.png';

export default class Comments extends Component {
    render() {
        console.log(this.props);
        const {comments} = this.props.event;
        const commentElements = comments.map(comment => {
            return (
              <div class='comment-block'>
                <img class='user-icon' src={comment.from.picture} />
                <div class='content'>
                    <div class='top'>
                        {comment.from.username}
                        <span>{Utils.getDateString(new Date(comment.time))}</span>
                        <button><img src={replyIcon} alt='reply' /></button>
                    </div>
                    {comment.content}
                </div>
              </div>
            );
        });

        return (
            <div class='comments-container'>
                {commentElements}
            </div>
        );
    }
}
