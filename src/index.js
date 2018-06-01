import {createElement, render, Component} from './framework';

const chapters = [
  {name: 'Chapter 1', url: '/1'},
  {name: 'Chapter 2', url: '/2'},
  {name: 'Chapter 3', url: '/3'},
  {name: 'Chapter 4', url: '/4'},
  {name: 'Chapter 5', url: '/5'},
];

class App extends Component {
  render() {
    return (
      <div>
        <h1>Test my framework</h1>
        <ul>
          {this.props.chapters.map(story => {
            return <Story name={story.name} url={story.url} />;
          })}
        </ul>
      </div>
    );
  }
}

class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {likes: Math.ceil(Math.random() * 100)};

    // router.add;
  }

  onLikeClicked() {
    this.setState({
      likes: this.state.likes + 1,
    });
  }

  onTextClicked() {
    // configuration
    // let router = Router.config({mode: 'history'});
  }

  render() {
    const {name, url} = this.props;
    const {likes} = this.state;
    // const likesElement = <span />;

    return (
      <li>
        <button onClick={e => this.onLikeClicked()}>{likes}<b> Likes</b></button>
        <span onClick={e => this.onTextClicked()}>{name}</span>
      </li>
    );
  }
}

render(<App chapters={chapters} />, document.getElementById('root'));
