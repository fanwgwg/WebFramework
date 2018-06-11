import {Component, createElement, connect} from '../framework';
import * as API from './api';
import * as Utils from './utils';
import * as Actions from './action';
import * as emailIcon from './assets/email.png';
import * as heartIcon from './assets/heart-gray.png';
import * as heartActiveIcon from './assets/heart-green-filled.png';
import * as tickIcon from './assets/tick-gray.png';
import * as tickActiveIcon from './assets/tick.png';
import * as pastIcon from './assets/footPrint.png';
import * as pastActiveIcon from './assets/footPrint-green.png';
import EventCard from './EventCard';
import NoResultContainer from './NoResultContainer';

class ProfileContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            activeTab: 0,
            relevantEvents: [],
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.userid != this.props.userid) {
            this.fetchData(newProps.userid);
        }
    }

    componentWillMount() {
        this.fetchData(this.props.userid);
    }

    componentDidMount() {
        if (!this.props.inDetail) {
            this.props.setInDetail(true);
        }
    }

    fetchData(userid) {
        API.getUserById(this.props.token, userid, data => {
            let ids = Utils.mergeArrayWithoutDuplicates(data.going, data.likes);
            API.getMultipleEvents(this.props.token, ids, events => {
                this.setState({
                    user: data,
                    relevantEvents: events,
                });
            });
        });
    }

    onTabClicked(index) {
        this.setState({
            activeTab: index,
        });
    }

    render() {
        const {user, activeTab} = this.state;
        const {currentUser} = this.props;

        if (!user) {
            return <div />;
        }

        const goingEvents = this.state.relevantEvents.filter(event => user.going.includes(event.id));
        const likeEvents = this.state.relevantEvents.filter(event => user.likes.includes(event.id));
        const pastEvents = this.state.relevantEvents.filter(event => Date(event.endTime) < Date());

        const events = [likeEvents, goingEvents, pastEvents];
        const eventCards = events[activeTab].map((event, index) => <EventCard
            key={index + 4}
            currentUser={currentUser}
            event={event}
        />);
        const noResultMessage = events[activeTab].length == 0 ? <NoResultContainer key={4} /> : null;

        return (
            <div class='profile-container'>
                <div class='profile' key={0}>
                    <img class='profile-picture' src={user.picture} />
                    {user.username}
                    <div class='email'>
                        <img src={emailIcon} />
                        {user.email}
                    </div>
                </div>
                <div class='divider' key={1}/>
                <div class='tabs-container' key={2}>
                    <div class='tab'
                        key={0}
                        style={activeTab == 0 ? 'color: #AECB4F' : ''}
                        onclick={() => this.onTabClicked(0)}>
                        <img src={activeTab == 0 ? heartActiveIcon : heartIcon} />
                        <span>{likeEvents.length.toString()} Likes</span>
                    </div>
                    <div class='tab'
                        key={1}
                        style={activeTab == 1 ? 'color: #AECB4F' : ''}
                        onclick={() => this.onTabClicked(1)}>
                        <img src={activeTab == 1 ? tickActiveIcon : tickIcon} />
                        <span>{goingEvents.length.toString()} Going</span>
                    </div>
                    <div class='tab'
                        key={2}
                        style={activeTab == 2 ? 'color: #AECB4F' : ''}
                        onclick={() => this.onTabClicked(2)}>
                        <img src={activeTab == 2 ? pastActiveIcon : pastIcon} />
                        <span>{pastEvents.length.toString()} Past</span>
                    </div>
                </div>
                <div class='divider' key={3}/>
                {noResultMessage}
                {eventCards}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        currentUser: state.currentUser,
        inDetail: state.inDetail,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setInDetail: data => dispatch({type: Actions.SET_IN_DETAIL, data}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
