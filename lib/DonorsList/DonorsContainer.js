import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import AddDonorButton from './AddDonorButton';
import DonorsList from './DonorsList';
import { defaultVisibleColumns } from './constants';

function DonorsContainer({
  donorsMap,
  fields,
  id,
  setDonorIds,
  showTriggerButton,
  visibleColumns,
  ...rest
}) {
  const stripes = useStripes();

  return (
    <>
      <DonorsList
        fields={fields}
        donorsMap={donorsMap}
        id={id}
        stripes={stripes}
        visibleColumns={visibleColumns}
      />
      <br />
      {
        showTriggerButton && (
          <AddDonorButton
            onAddDonors={setDonorIds}
            fields={fields}
            stripes={stripes}
            name={id}
            {...rest}
          />
        )
      }
    </>
  );
}

DonorsContainer.propTypes = {
  columnWidths: PropTypes.object,
  donorsMap: PropTypes.object,
  fields: PropTypes.object,
  formatter: PropTypes.object,
  id: PropTypes.string.isRequired,
  searchLabel: PropTypes.node,
  setDonorIds: PropTypes.func.isRequired,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsContainer.defaultProps = {
  showTriggerButton: true,
  visibleColumns: defaultVisibleColumns,
};

export default DonorsContainer;
