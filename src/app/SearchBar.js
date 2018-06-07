import {Component, createElement, connect} from '../framework';
import {timeRanges, tags} from './Constants';
import * as Actions from './action';
import * as Utils from './utils';
import * as searchIcon from './assets/search.png';
import * as rightArrow from './assets/right-arrow.png';
import * as leftArrow from './assets/left-arrow.png';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            time: this.props.time,
            tagIds: this.props.tagIds,
            fromTime: this.props.fromTime,
            toTime: this.props.toTime,
            isTyping: -1,
        });

        this.onTimeInputChanged = this.onTimeInputChanged.bind(this);
    }

    componentDidMount() {
        if (this.props.fromTime && this.fromTimeInput) {
            this.fromTimeInput.value = Utils.getFormattedDate(this.props.fromTime);
        }

        if (this.props.toTime && this.toTimeInput) {
            this.toTimeInput.value = Utils.getFormattedDate(this.props.toTime);
        }

        window.addEventListener('click', this.clickHandler, false);

        Utils.disableScroll();
    }

    componentWillUnmount() {
        Utils.enableScroll();

        window.removeEventListener('click', this.clickHandler, false);
    }

    clickHandler(e) {
        if (document.getElementById('searchbar').contains(e.target)) {
            console.log('click in sidebar');
        } else {
            console.log('click outside sidebar');
        }
    }

    onTimeSelected(time) {
        this.setState({
            time: time,
        });
    }

    onTagSelected(tag) {
        console.log(`tag is ${tag}`);
        if (tag == 0) {
            this.setState({
                tagIds: [0],
            });

            return;
        }

        if (this.state.tagIds.includes(0)) {
            this.setState({
                tagIds: [tag],
            });

            return;
        }

        let selected = this.state.tagIds;
        let index = selected.indexOf(tag);

        if (index < 0) {
            console.log(`push ${tag}`);
            selected.push(tag);
        } else {
            selected.splice(index, 1);
        }

        if (selected.length == 0) {
            selected = [0];
        }

        this.setState({
            tagIds: selected,
        });
    }

    onTimeInputChanged(value, index) {
        if (Utils.isValidDate(value)) {
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

    onSearchClicked() {
        if (this.shouldEnableSearch()) {
            return;
        }

        if (this.state.time.description !== timeRanges.LATER.description) {
            this.props.updateSearchFilter(this.state.time, this.state.tagIds);
        } else if (this.state.fromTime && this.state.toTime) {
            this.props.updateSearchFilter({
                description: this.state.time.description,
                fromTime: this.state.fromTime,
                toTime: this.state.toTime,
            }, this.state.tagIds);
        }

        this.props.onSearchStarted();
    }

    shouldEnableSearch() {
        const {time, tagIds, fromTime, toTime, isTyping} = this.state;
        return time.description == timeRanges.LATER.description && (!fromTime || !toTime || fromTime > toTime);
    }

    render() {
        const {time, tagIds, fromTime, toTime, isTyping} = this.state;
        const timeSelections = Object.keys(timeRanges).map(t => {
            let isSelected = time.description == timeRanges[t].description;
            let style = isSelected ?
                'background: #E5F7A9; box-shadow: 2px 2px 5px #414141; color: #453257'
                : 'background: transparent; box-shadow: none';
            let className = (timeRanges[t].description == timeRanges.LATER.description
                && time.description == timeRanges.LATER.description) ? 'arrowed' : '';

            return (
                <div class={className}>
                    <button style={style} onclick={() => this.onTimeSelected(timeRanges[t])}>
                        {timeRanges[t].description.toUpperCase()}
                    </button>
                </div>
            );
        });

        const tagSelections = tags.map((t, index) => {
            let isSelected = tagIds.includes(index);
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

        let message = `Please type in format of ${Utils.getFormattedDate(new Date())}`;
        if ((isTyping == 0 && !fromTime)
            || (isTyping == 1 && !toTime)) {
            message = 'Time format incorrect, the correct format should be YYYY-MM-DD';
        } else if (isTyping == 0 && fromTime
            && isTyping == 1 && toTime
            && fromTime > toTime) {
            message = 'The from time should be earlier than to time.';
        } else if ((isTyping == 0 && fromTime)
            || (isTyping == 1 && toTime)) {
            message = 'Format correct!';
        }

        const timeInput = time.description == timeRanges.LATER.description ? (
            <div class='time-input-container'>
                <div class='main'>
                    <img src={rightArrow} alt='from' />
                    <input
                        ref={fromTimeInput => this.fromTimeInput = fromTimeInput}
                        onkeyup={e => this.onTimeInputChanged(e.target.value.trim(), 0)}
                        onfocusout={this.onInputFocusOut.bind(this)}
                    />
                    <img src={leftArrow} alt='to' />
                    <input
                        ref={toTimeInput => this.toTimeInput = toTimeInput}
                        onkeyup={(e) => this.onTimeInputChanged(e.target.value.trim(), 1)}
                        onfocusout={this.onInputFocusOut.bind(this)}
                    />
                </div>
                <div class='message'>{message}</div>
            </div>
        ) : null;

        let searchButtonStyle = this.shouldEnableSearch() ? 'background: gray; cursor: default; opacity: 0.7' : null;

        return (
            <div class='searchbar' id='searchbar'>
                <div class='section'>
                    <div class='title'><u>TIME</u></div>
                    <div class='content'>{timeSelections}</div>
                    {timeInput}
                </div>
                <div class='section'>
                    <div class='title'><u>TAG</u></div>
                    <div class='content'>{tagSelections}</div>
                </div>
                <button class='search-button' style={searchButtonStyle} onclick={this.onSearchClicked.bind(this)}>
                    <img src={searchIcon} />
                    Search
                </button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateSearchFilter: (searchTimeFilter, searchTagFilter) => dispatch({
            type: Actions.UPDATE_SEARCH_FILTER,
            searchTimeFilter,
            searchTagFilter,
        }),
    };
};

const mapStateToProps = state => {
    return {
        time: state.searchTimeFilter ? state.searchTimeFilter : null,
        fromTime: state.searchTimeFilter ? state.searchTimeFilter.fromTime : null,
        toTime: state.searchTimeFilter ? state.searchTimeFilter.toTime : null,
        tagIds: state.searchTagFilter,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
