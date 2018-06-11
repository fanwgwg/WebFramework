import {createElement} from '../framework';
import * as activityIcon from './assets/activity.png';

const NoResultContainer = () => (
    <div class='no-result-container'>
        <img src={activityIcon} />
        No event found
    </div>
);

export default NoResultContainer;
