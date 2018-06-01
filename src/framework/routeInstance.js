const instances = [];
const register = (comp) => {
  instances.push(comp);
  console.log('push ' + comp.props.path + ', current instances: ' + instances.map(i => i.props.path));
};
const unregister = (comp) => {
  instances.splice(instances.indexOf(comp), 1);
  console.log('remove ' + comp.props.path + ', current instances: ' + instances.map(i => i.props.path));
};
const update = () =>{
  console.log('update instance: ' + instances.length + ', current instances: ' + instances.map(i => i.props.path));
  instances.forEach(instance => {
    if (instance) {
      instance.forceUpdate();
    }
  });
};

export {
  update,
  register,
  unregister,
};
