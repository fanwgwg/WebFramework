function isPureComponent(element) {
    const isClass = typeof element === 'function'
        && /^class\s/.test(Function.prototype.toString.call(element));
    return !isClass && typeof element === 'function';
}

function flatten(arr) {
    return arr.reduce((flat, toFlatten) =>
        flat.concat(Array.isArray(toFlatten) ?
            flatten(toFlatten) :
            toFlatten
        )
        , []);
}

const createElement = (type, attributes = {}, ...child) => {
    const children = child.length > 0 ? child.slice() : [];
    const childElements = flatten(children).filter(c => c).map(c =>
        c instanceof Object ? c : createElement('text', {textContent: c})
    );
    const isPure = isPureComponent(type);
    const elementType = isPure ? PureComponent : type;
    const renderFunction = isPure ? type : undefined;

    return {
        type: elementType,
        renderFunction,
        children: childElements,
        props: Object.assign(
            {children: childElements},
            attributes
        ),
    };
};

// Stateless component
class PureComponent {
    constructor(props) {
        this.props = props || {};
        this.onRender = () => { };
        this._domElement = null;
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillReceiveProps() { }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUpdate() { }

    componentDidUpdate() { }

    componentWillUnmount() { }

    updateProps(newProps) {
        this.props = newProps;
    }

    setRenderCallback(callback) {
        this.onRender = callback;
    }

    setChild(component) {
        this._child = component;
        component._parentComponent = this;
    }

    getDomElement() {
        return this._domElement;
    }

    setDomElement(domElement) {
        this._domElement = domElement;
    }

    getChild() {
        return this._child;
    }

    getRoot() {
        let component = this;
        let res;
        while (component) {
            res = component;
            component = component._parentComponent;
        }
        return res;
    }

    render() {
        return this.onRender(this.props);
    }
}

class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};
        this.onStateChange = () => { };
        this._domElement = null;
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillReceiveProps() { }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUpdate() { }

    componentDidUpdate() { }

    componentWillUnmount() { }

    setState(newState) {
        const prevState = this.state;
        const nextState = Object.assign({}, prevState || {}, newState);
        this.onStateChange(this, nextState);
    }

    setStateCallback(callback) {
        this.onStateChange = callback;
    }

    setChild(component) {
        this._child = component;
        component._parentComponent = this;
    }

    getDomElement() {
        return this._domElement;
    }

    setDomElement(domElement) {
        this._domElement = domElement;
    }

    getChild() {
        return this._child;
    }

    getRoot() {
        let component = this;
        let res;
        while (component) {
            res = component;
            component = component._parentComponent;
        }
        return res;
    }

    updateProps(newProps) {
        this.props = newProps;
    }

    updateState(newState) {
        this.state = newState;
    }

    render() { }

    forceUpdate() {
        this.onStateChange(this, this.state);
    }
}

export {
    createElement,
    Component,
};
