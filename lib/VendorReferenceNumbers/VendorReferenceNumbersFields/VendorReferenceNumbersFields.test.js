import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Button } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import { REF_NUMBER_TYPE } from '../../constants';
import VendorReferenceNumbersFields from './VendorReferenceNumbersFields';

// eslint-disable-next-line react/prop-types
const renderForm = ({ handleSubmit }) => (
  <form>
    <VendorReferenceNumbersFields />
    <Button
      data-testid="submit"
      // eslint-disable-next-line react/prop-types
      onClick={handleSubmit}
    >
      Save
    </Button>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} {...props} />
  </MemoryRouter>,
));

describe('VendorReferenceNumbersFields', () => {
  it('should add new record fields and show validation errors', async () => {
    renderComponent();
    expect(screen.queryByText('stripes-acq-components.referenceNumbers.refNumber')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('stripes-acq-components.referenceNumbers.addReferenceNumbers'));

    expect(screen.getByText('stripes-acq-components.referenceNumbers.refNumber')).toBeInTheDocument();
    expect(screen.queryByText('stripes-acq-components.validation.required')).not.toBeInTheDocument();

    await userEvent.type(screen.getByTestId('referenceNumbers[0].refNumber'), 'some');
    await userEvent.click(screen.getByText('Save'));

    expect(screen.getByText('stripes-acq-components.validation.required')).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByTestId('referenceNumbers[0].refNumberType'), REF_NUMBER_TYPE.continuationRefNumber);

    expect(screen.queryByText('stripes-acq-components.validation.required')).not.toBeInTheDocument();
  });

  it('should display preselected and handle clicks', () => {
    const referenceNumbers = [{ refNumber: 'TEST', refNumberType: REF_NUMBER_TYPE.titleNumber }];

    renderComponent({ initialValues: { referenceNumbers } });
    expect(screen.getByTestId('referenceNumbers[0].refNumber').value).toBe('TEST');
    expect(screen.getByDisplayValue('stripes-acq-components.referenceNumbers.refNumberType.titleNumber')).toBeInTheDocument();
  });
});
