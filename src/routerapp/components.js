import {Component, createElement, Link, Route} from '../framework';

// class Home extends Component {
//   render() {
//     return <div>Home</div>;
//   }
// }

const Home = ({name}) => (
  <div>{name}</div>
);

class About extends Component {
  render() {
    return <div>About</div>;
  }
}

class Topic extends Component {
  render() {
    const {topicId} = this.props;
    return <div>{topicId}</div>;
  }
}

class Topics extends Component {
  render() {
    const items = [
      {name: 'topic 1', slug: '1'},
      {name: 'topic 2', slug: '2'},
      {name: 'topic 3', slug: '3'},
    ];

    const {match} = this.props;

    console.log(`match: ${match.url}`);

    return (
      <div>
        <h2>Topics</h2>
        <ul>
          {items.map(({name, slug}) => (
            <li key={name}>
              <Link to={`${match.path}/${slug}`}>{name}</Link>
            </li>
          ))}
        </ul>

        {items.map(({name, slug}) => (
          <Route
            key={name}
            path={`${match.path}/${slug}`}
            render={() => <Topic topicId={name} />}
          />
        ))}
      </div>
    );
  }
}

/*
  // normally, components should be located and imported like this.
  import Home from './Home'
  import About from './About'
  import Topic from './Topic'
  import Topics from './Topics'
*/

export {Home, About, Topic, Topics};
