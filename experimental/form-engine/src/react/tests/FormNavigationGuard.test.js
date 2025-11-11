/* Developed collaboratively using AI (Cursor) */

import { createMemoryHistory } from 'history';
import {
  Router,
  Route,
} from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Field,
  Form,
} from '../../index';

describe('FormNavigationGuard', () => {
  it('should block navigation when form is dirty', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
              navigationGuardProps={{ message: 'Unsaved changes' }}
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div>B</div>} />
      </Router>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));
    expect(history.location.pathname).toBe('/a');
  });
});
