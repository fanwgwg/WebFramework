import {Component, createElement, connect} from '../framework';
import * as Utils from './utils';
import * as replyIcon from './assets/reply.png';
import * as Actions from './action';

class Comments extends Component {
    onReplyCommentClicked(username) {
        this.props.onReplyCommentClicked(username);
    }

    onUserClicked(id) {
        history.pushState({}, null, `/profile/${id}`);
        this.props.setInDetail(true);
    }

    render() {
        const {comments} = this.props.event;


        const commentElements = comments.map(comment => {
            let replyUserName = null;
            if (comment.replyTo) {
                replyUserName = (
                    <span
                        class='title'
                        onclick={() => this.onUserClicked(comment.replyTo.userid)}
                    > @ {comment.replyTo.username}
                    </span>
                );
            }

            const date = new Date(comment.time);
            const time = Utils.getTimeString(date);
            const day = Utils.getFormattedDate(date);

            return (
                <div class='comment-block'>
                    <img class='user-icon' src={comment.from.picture} onclick={() => this.onUserClicked(comment.from.userid)}/>
                    <div class='content'>
                        <div class='top'>
                            <span class='title' onclick={() => this.onUserClicked(comment.from.userid)}>{comment.from.username}</span>
                            {replyUserName}
                            <span class='time'>{time.time} {time.period} {day}</span>
                            <button onclick={e => this.onReplyCommentClicked(comment.from)}>
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

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        token: state.token,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setInDetail: data => dispatch({type: Actions.SET_IN_DETAIL, data}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
