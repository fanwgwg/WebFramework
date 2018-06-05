import {Component, createElement} from '../framework';
import {timeRanges, tags} from './Constants';

export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = ({
            time: [timeRanges.ANYTIME],
            tags: [0],
        });
    }

    onTimeSelected(time) {
        let selected = this.state.time;
        let index = selected.indexOf(time);
        if (index < 0) {
            selected.push(time);
        } else {
            selected.splice(index, 1);
        }

        if (selected.length == 0) {
            selected = [timeRanges.ANYTIME];
        }

        this.setState({
            time: selected,
        });
    }

    onTagSelected(tag) {
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

    render() {
        const timeSelections = Object.keys(timeRanges).map(t => {
            let isSelected = this.state.time.includes(timeRanges[t]);
            let style = isSelected ?
                'background: #E5F7A9; box-shadow: 2px 2px 5px #bcbcbc4d'
                : 'background: transparent; box-shadow: none';

            return (
                <div>
                    <button style={style} onclick={() => this.onTimeSelected(timeRanges[t])}>
                        {timeRanges[t].toUpperCase()}
                    </button>
                </div>
            );
        });

        const tagSelections = tags.map((t, index) => {
            let isSelected = this.state.tags.includes(index);
            let style = isSelected ?
                'background: #E5F7A9; box-shadow: 2px 2px 5px #bcbcbc4d; border: 1px solid transparent; color: #453257'
                : 'background: transparent; box-shadow: none; border: 1px solid #453257; color: #453257; font-weight: normal';

            return (
                <div>
                    <button style={style} onclick={() => this.onTagSelected(index)}>
                        {tags[index]}
                    </button>
                </div>
            );
        });

        return (
            <div class='searchbar'>
                <div class='section'>
                    <div class='title'><u>TIME</u></div>
                    <div class='content'>{timeSelections}</div>
                </div>
                <div class='section'>
                    <div class='title'><u>TAG</u></div>
                    <div class='content'>{tagSelections}</div>
                </div>
                <button class='search-button'>
                Search
                </button>
            </div>
        );
    }
}
