import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

export function mountWithRouter(component) {
  return mount(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      {component}
    </MemoryRouter>
  );
}

export function shallowWithRouter(component) {
  return shallow(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      {component}
    </MemoryRouter>
  );
}
