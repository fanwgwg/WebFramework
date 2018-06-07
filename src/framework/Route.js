import {Component, createElement} from './framework';
import {register, unregister} from './routeInstance';
import pathToRegexp from 'path-to-regexp';

const matchPath = (pathname, options) => {
  const {exact = false, path} = options;

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
    };
  }

  let keys = [];
  let re = pathToRegexp(path, keys);
  let match = re.exec(pathname);

  if (!match) {
    return null;
  }

  const url = match[0];
  const isExact = pathname === url;

  if (exact && !isExact) {
    return null;
  }

  return {path, url, isExact, params: match.slice(1)};
};

export class Route extends Component {
  constructor(props) {
    super(props);

    this.handlePop = this.handlePop.bind(this);
  }

  componentWillMount() {
    console.log('route will mount: ' + this.props.path);
    addEventListener('popstate', this.handlePop);
    register(this);
  }

  componentWillUnmount() {
    console.log('route will unmount: ' + this.props.path);

    let {path, exact} = this.props;
    let match = matchPath(location.pathname, {path, exact});

    if (match) {
      return;
    }

    unregister(this);
    removeEventListener('popstate', this.handlePop);
  }

  handlePop() {
    this.forceUpdate();
  }

  render() {
    console.log('render route ' + this.props.path);
    console.log('current pathname ' + location.pathname);
    const {path, exact, render, enabled} = this.props;
    const match = matchPath(location.pathname, {path, exact});

    if (!enabled || !match) {
      return <div class="route" />;
    }

    if (render) {
      return <div class="route">{render({match})}</div>;
    }

    return <div class="route" />;
  }
}
