import {Component, createElement} from '../framework';

class EventDetailPage extends Component {
    render() {
        console.log(this.props);
        return (
            <div>
                Event detail
            </div>
        );
    }
};

export default EventDetailPage;
