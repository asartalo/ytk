import { mount, shallow } from 'enzyme';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';

export function mountWithRouter(component) {
  const options = new ReactRouterEnzymeContext();
  return mount(component, options.get());
}

export function shallowWithRouter(component) {
  const options = new ReactRouterEnzymeContext();
  return shallow(component, options.get());
}
