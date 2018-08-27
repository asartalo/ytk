import { mount } from 'enzyme';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';

export default function mountWithRouter(component) {
  const options = new ReactRouterEnzymeContext();
  return mount(component, options.get());
}
