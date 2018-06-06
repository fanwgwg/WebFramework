import {Component, createElement} from '../framework';
import {timeRanges, tags} from './Constants';
import * as searchIcon from './assets/search.png';
import * as rightArrow from './assets/right-arrow.png';
import * as leftArrow from './assets/left-arrow.png';

export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = ({
            time: [timeRanges.ANYTIME],
            tags: [0],
            fromTime: null,
            toTime: null,
            isTyping: -1,
        });

        this.onTimeInputChanged = this.onTimeInputChanged.bind(this);
    }

    onTimeSelected(time) {
        this.setState({
            time: time,
        });
    }

    onTagSelected(tag) {
        if (tag == 0) {
            this.setState({
                tags: [0],
            });

            return;
        }

        if (this.state.tags.includes(0)) {
            this.setState({
                tags: [tag],
            });

            return;
        }

        let selected = this.state.tags;
        let index = selected.indexOf(tag);

        if (index < 0) {
            selected.push(tag);
        } else {
            selected.splice(index, 1);
        }

        if (selected.length == 0) {
            selected = [0];
        }

        this.setState({
            tags: selected,
        });
    }

    onTimeInputChanged(value, index) {
        if (this.isValidDate(value)) {
            if (index == 0) {
                this.setState({
                    isTyping: 0,
                    fromTime: new Date(value),
                });
            } else if (index == 1) {
                this.setState({
                    isTyping: 1,
                    toTime: new Date(value),
                });
            }
        } else if (index == 0) {
            this.setState({
                isTyping: 0,
                fromTime: null,
            });
        } else if (index == 1) {
            this.setState({
                isTyping: 1,
                toTime: null,
            });
        }
    }

    onInputFocusOut() {
        this.setState({
            isTyping: -1,
        });
    }

    isValidDate(dateString) {
        let regexDate = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

        if (!regexDate.test(dateString)) {
            return false;
        }

        let parts = dateString.split('-');
        let day = parseInt(parts[2], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[0], 10);

        if (year < 1000 || year > 3000 || month == 0 || month > 12) {
            return false;
        }

        let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
            monthLength[1] = 29;
        }

        return day > 0 && day <= monthLength[month - 1];
    }

    render() {
        const timeSelections = Object.keys(timeRanges).map(t => {
            let isSelected = this.state.time == timeRanges[t];
            let style = isSelected ?
                'background: #E5F7A9; box-shadow: 2px 2px 5px #414141; color: #453257'
                : 'background: transparent; box-shadow: none';
            let className = (timeRanges[t] == timeRanges.LATER && this.state.time == timeRanges.LATER) ? 'arrowed' : '';

            return (
                <div class={className}>
                    <button style={style} onclick={() => this.onTimeSelected(timeRanges[t])}>
                        {timeRanges[t].toUpperCase()}
                    </button>
                </div>
            );
        });

        const tagSelections = tags.map((t, index) => {
            let isSelected = this.state.tags.includes(index);
            let style = isSelected ?
                'background: #E5F7A9; box-shadow: 2px 2px 5px #414141; border: 1px solid transparent; color: #453257'
                : 'background: transparent; box-shadow: none; border: 1px solid white; color: white; font-weight: normal';

            return (
                <div>
                    <button class='button-with-border' style={style} onclick={() => this.onTagSelected(index)}>
                        {tags[index]}
                    </button>
                </div>
            );
        });

        let message = `Please type in format of ${new Date().toISOString().slice(0, 10)}`;
        if ((this.state.isTyping == 0 && !this.state.fromTime)
            || (this.state.isTyping == 1 && !this.state.toTime)) {
            message = 'Time format incorrect, the correct format should be YYYY-MM-DD';
        } else if ((this.state.isTyping == 0 && this.state.fromTime
            || this.state.isTyping == 1 && this.state.toTime)
            && this.state.fromTime > this.state.toTime) {
            message = 'The from time should be earlier than to time.';
        } else if ((this.state.isTyping == 0 && this.state.fromTime)
            || (this.state.isTyping == 1 && this.state.toTime)) {
            message = 'Format correct!';
        }

        const timeInput = this.state.time == timeRanges.LATER ? (
            <div class='time-input-container'>
                <div class='main'>
                    <img src={rightArrow} alt='from' />
                    <input onkeyup={(e) => this.onTimeInputChanged(e.target.value.trim(), 0)} onfocusout={this.onInputFocusOut.bind(this)} />
                    <img src={leftArrow} alt='to' />
                    <input onkeyup={(e) => this.onTimeInputChanged(e.target.value.trim(), 1)} onfocusout={this.onInputFocusOut.bind(this)} />
                </div>
                <div class='message'>{message}</div>
            </div>
        ) : null;

        return (
            <div class='searchbar'>
                <div class='section'>
                    <div class='title'><u>TIME</u></div>
                    <div class='content'>{timeSelections}</div>
                    {timeInput}
                </div>
                <div class='section'>
                    <div class='title'><u>TAG</u></div>
                    <div class='content'>{tagSelections}</div>
                </div>
                <button class='search-button'>
                    <img src={searchIcon} />
                    Search
                </button>
            </div>
        );
    }
}
