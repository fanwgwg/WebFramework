/**
 * Takes a virtual element created by createElement function, a container node, and
 * the old DOM element that is going to be replaced or updated.
 */
function diff(virtualElement, container, oldDomElement, parentComponent) {
    const oldVirtualElement = oldDomElement && oldDomElement._virtualElement;
    const oldComponent = oldVirtualElement && oldVirtualElement.component;

    if (typeof virtualElement.type === 'function') {
        diffComponent(virtualElement, oldComponent, container, oldDomElement, parentComponent);
    } else if (
        oldVirtualElement &&
        oldVirtualElement.type === virtualElement.type &&
        oldComponent === virtualElement.component
    ) {
        if (oldVirtualElement.type === 'text') {
            updateTextNode(oldDomElement, virtualElement, oldVirtualElement);
        } else {
            updateDomElement(oldDomElement, virtualElement, oldVirtualElement);
        }

        // save the virtualElement on the domElement
        // so that it can be retrieved it next time
        oldDomElement._virtualElement = virtualElement;

        diffList(virtualElement.children, oldDomElement);
    } else {
        // Insert virtual element to DOM if it is a new one
        mountElement(virtualElement, container, oldDomElement);
    }
}

function getKey(virtualElement) {
    if (!virtualElement) {
        return undefined;
    }

    const component = virtualElement.component;

    return component ? component.props.key : virtualElement.props.key;
}

function diffList(virtualElements, parentDomElement) {
    const keyedElements = {};
    const unkeyedElements = [];

    for (let i = 0; i < parentDomElement.childNodes.length; i += 1) {
        const domElement = parentDomElement.childNodes[i];
        const key = getKey(domElement._virtualElement);

        if (key) {
            keyedElements[key] = domElement;
        } else {
            unkeyedElements.push(domElement);
        }
    }

    let unkeyedIndex = 0;
    virtualElements.forEach((virtualElement, i) => {
        const key = virtualElement.props.key;
        if (key) {
            const keyedDomElement = keyedElements[key];
            if (keyedDomElement) {
                // move to correct location
                if (
                    parentDomElement.childNodes[i] &&
                    !parentDomElement.childNodes[i].isSameNode(keyedDomElement)
                ) {
                    if (parentDomElement.childNodes[i]) {
                        parentDomElement.insertBefore(
                            keyedDomElement,
                            parentDomElement.childNodes[i]
                        );
                    } else {
                        parentDomElement.append(keyedDomElement);
                    }
                }

                diff(virtualElement, parentDomElement, keyedDomElement);
            } else {
                const placeholder = document.createElement('span');
                if (parentDomElement.childNodes[i]) {
                    parentDomElement.insertBefore(placeholder, parentDomElement.childNodes[i]);
                } else {
                    parentDomElement.append(placeholder);
                }
                mountElement(virtualElement, parentDomElement, placeholder);
            }
        } else {
            const unkeyedDomElement = unkeyedElements[unkeyedIndex];
            if (unkeyedElements) {
                if (
                    parentDomElement.childNodes[i] &&
                    !parentDomElement.childNodes[i].isSameNode(unkeyedDomElement)
                ) {
                    if (parentDomElement.childNodes[i]) {
                        parentDomElement.insertBefore(
                            unkeyedDomElement,
                            parentDomElement.childNodes[i]
                        );
                    } else {
                        parentDomElement.append(unkeyedDomElement);
                    }
                }

                diff(virtualElement, parentDomElement, unkeyedDomElement);
            } else {
                const placeholder = document.createElement('span');
                if (parentDomElement.childNodes[i]) {
                    parentDomElement.insertBefore(placeholder, parentDomElement.childNodes[i]);
                } else {
                    parentDomElement.append(placeholder);
                }
                mountElement(virtualElement, parentDomElement, placeholder);
            }
            unkeyedIndex += 1;
        }
    });


    // remove extra children
    const oldChildren = parentDomElement.childNodes;
    while (oldChildren.length > virtualElements.length) {
        unmountNode(oldChildren[virtualElements.length]);
    }
}

function diffComponent(newVirtualElement, oldComponent, container, domElement, parentComponent) {
    if (oldComponent && newVirtualElement.type === oldComponent.constructor) {
        oldComponent.componentWillReceiveProps(newVirtualElement.props);

        if (oldComponent.shouldComponentUpdate(newVirtualElement.props)) {
            const prevProps = oldComponent.props;
            oldComponent.componentWillUpdate(newVirtualElement.props, oldComponent.state);

            // update component
            oldComponent.updateProps(newVirtualElement.props);

            // nextElement is a new virtual element
            const nextElement = oldComponent.render();
            nextElement.component = parentComponent || oldComponent;

            const childComponent = oldComponent.getChild();

            // recursively diffComponent for child component
            if (childComponent) {
                diffComponent(
                    nextElement,
                    childComponent,
                    container,
                    domElement,
                    oldComponent
                );
            } else {
                diff(nextElement, container, domElement, oldComponent);
            }

            oldComponent.componentDidUpdate(prevProps);
        }
    } else {
        let component = oldComponent;
        while (component) {
            component.componentWillUnmount();
            component._didUnmount = true;
            component.setDomElement(null);
            component = component.getChild();
        }

        mountElement(newVirtualElement, container, domElement, parentComponent);
    }
}

function unmountNode(domElement, parentComponent) {
    const virtualElement = domElement._virtualElement;
    if (!virtualElement) {
        domElement.remove();
        return;
    }

    if (!parentComponent) {
        let component = virtualElement.component;
        while (component && !component._didUnmount) {
            component.componentWillUnmount();
            component.setDomElement(undefined);
            component = component.getChild();
        }
    }

    while (domElement.childNodes.length > 0) {
        unmountNode(domElement.firstChild);
    }

    if (virtualElement.props.ref) {
        virtualElement.props.ref(null);
    }

    Object.keys(virtualElement.props).forEach((propName) => {
        if (propName.slice(0, 2) === 'on') {
            const event = propName.toLowerCase().slice(2);
            const handler = virtualElement.props[propName];
            domElement.removeEventListener(event, handler);
        }
    });

    domElement.remove();
}

function updateTextNode(domElement, newVirtualElement, oldVirtualElement) {
    if (newVirtualElement.props.textContent !== oldVirtualElement.props.textContent) {
        domElement.textContent = newVirtualElement.props.textContent;
    }

    domElement._virtualElement = newVirtualElement;
}

function updateDomElement(domElement, newVirtualElement, oldVirtualElement = {}) {
    const newProps = newVirtualElement.props;
    const oldProps = oldVirtualElement.props || {};

    // Compare each attribute in props, update if there are any changes
    Object.keys(newProps).forEach(propName => {
        const newProp = newProps[propName];
        const oldProp = oldProps[propName];

        if (newProp !== oldProp) {
            if (propName.slice(0, 2) === 'on') {
                const eventName = propName.toLowerCase().slice(2);
                domElement.addEventListener(eventName, newProp, false);
                if (oldProp) {
                    domElement.removeEventListener(eventName, oldProp, false);
                }
            } else if (propName === 'value' || propName === 'checked') {
                domElement[propName] = newProp;
            } else if (propName !== 'key' && propName !== 'children') {
                domElement.setAttribute(propName, newProps[propName]);
            }
        }
    });

    // remove old attributes that no longer exist
    Object.keys(oldProps).forEach((propName) => {
        const newProp = newProps[propName];
        const oldProp = oldProps[propName];

        if (!newProp) {
            if (propName.slice(0, 2) === 'on') {
                domElement.removeEventListener(propName, oldProp, false);
            } else if (propName !== 'children') {
                domElement.removeAttribute(propName);
            }
        }
    });
}

/**
 * Creates a new component from the constructor, which is stored in virtualElement.type
 */
function mountComponent(virtualElement, container, oldDomElement, parentComponent) {
    const component = new virtualElement.type(virtualElement.props);

    // Only pure component has an attribute renderFunction
    if (virtualElement.renderFunction) {
        component.setRenderCallback(virtualElement.renderFunction);
    } else {
        component.setStateCallback(handleComponentStateChange);
    }

    const nextElement = component.render();

    if (parentComponent) {
        const root = parentComponent.getRoot();
        nextElement.component = root;
        parentComponent.setChild(component);
    } else {
        nextElement.component = component;
    }

    component.componentWillMount();

    // Check if the new virtual element is a component, mountComponent recursively if it is.
    if (typeof nextElement.type === 'function') {
        mountComponent(nextElement, container, oldDomElement, component);
    } else {
        mountElement(nextElement, container, oldDomElement, parentComponent);
    }

    component.componentDidMount();

    if (component.props.ref) {
        component.props.ref(component);
    }
}

/**
 * Update state of a component, rerender it and start the normal differing process
 */
function handleComponentStateChange(component, nextState) {
    const prevState = component.state;
    if (component.shouldComponentUpdate(component.props, nextState)) {
        component.componentWillUpdate(component.props, nextState);
        component.updateState(nextState);

        const nextElement = component.render();
        nextElement.component = component.getRoot();

        // start the normal diffing process here
        const domElement = component.getDomElement();
        const container = domElement.parentNode;
        const childComponent = component.getChild();

        if (childComponent) {
            diffComponent(
                nextElement,
                childComponent,
                container,
                domElement,
                component
            );
        } else {
            diff(nextElement, container, domElement, component);
        }

        component.componentDidUpdate(component.props, prevState);
    }
}

/**
 * Creates either a new text node or a DOM element depending on type of
 * the virtual element. It removes the old DOM element and inserts the
 * new one.
 */
function mountSimpleNode(virtualElement, container, oldDomElement, parentComponent) {
    let newDomElement;
    const nextSibling = oldDomElement && oldDomElement.nextSibling;

    if (virtualElement.type === 'text') {
        newDomElement = document.createTextNode(virtualElement.props.textContent);
    } else {
        newDomElement = document.createElement(virtualElement.type);
        updateDomElement(newDomElement, virtualElement);
    }

    // save the virtualElement on the domElement
    // so that we can retrieve it next time
    newDomElement._virtualElement = virtualElement;

    if (oldDomElement) {
        unmountNode(oldDomElement, parentComponent);
    }

    // add the newly created node to the dom
    if (nextSibling) {
        container.insertBefore(newDomElement, nextSibling);
    } else {
        container.appendChild(newDomElement);
    }

    // update references to new Dom element
    let component = virtualElement.component;
    while (component) {
        component.setDomElement(newDomElement);
        component = component.getChild();
    }

    // recursively call mountElement with all child virtualElements
    virtualElement.children.forEach((childElement) => {
        mountElement(childElement, newDomElement);
    });

    if (virtualElement.props.ref) {
        virtualElement.props.ref(newDomElement);
    }
}

function mountElement(virtualElement, container, oldDomElement, parentComponent) {
    // console.log("mount element");
    if (typeof virtualElement.type === 'function') {
        mountComponent(virtualElement, container, oldDomElement, parentComponent);
    } else {
        mountSimpleNode(virtualElement, container, oldDomElement, parentComponent);
    }
}

export function render(virtualElement, container) {
    diff(virtualElement, container, container.firstChild);
}
