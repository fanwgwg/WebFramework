import {Component, createElement} from '../framework';
import * as Utils from './utils';
import * as replyIcon from './assets/reply.png';

export default class Comments extends Component {
    onRelyCommentClicked(username) {
        this.props.onReplyCommentClicked(username);
    }

    render() {
        const {comments} = this.props.event;


        const commentElements = comments.map(comment => {
            let title = comment.from.username;
            if (comment.replyTo) {
                title += ` @ ${comment.replyTo.username}`;
            }

            return (
                <div class='comment-block'>
                    <img class='user-icon' src={comment.from.picture} />
                    <div class='content'>
                        <div class='top'>
                            {title}
                            <span>{Utils.getDateString(new Date(comment.time))}</span>
                            <button onclick={e => this.onRelyCommentClicked(comment.from)}>
                                <img src={replyIcon} alt='reply' />
                            </button>
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
