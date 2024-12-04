/* Developed collaboratively using AI (Chat GPT) */

import { useIntl } from 'react-intl';

import { getFullName } from '@folio/stripes/util';

export const useVersionHistoryValueResolvers = () => {
  const intl = useIntl();
  const deletedRecordLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });

  /**
     * Resolves a value from a map by ID and property.
     * @param {string} id - The ID to resolve.
     * @param {string} property - The property to retrieve from the map entry.
     * @param {Object} obj - The map object containing items.
     * @returns {string | null} - Resolved value or fallback label.
     */
  const getObjectPropertyById = (id, property, obj = {}) => {
    if (!id) return null;
    if (id in obj) {
      return obj[id]?.[property] || null;
    }

    return deletedRecordLabel;
  };

  /**
     * Resolves a user's full name by ID using a users map.
     * @param {string} id - The user ID to resolve.
     * @param {Object} usersMap - The map of user objects.
     * @returns {string | null} - Full name of the user or fallback label.
     */
  const getUserFullNameById = (id, usersMap = {}) => {
    if (!id) return null;

    return id in usersMap
      ? getFullName(usersMap[id])
      : deletedRecordLabel;
  };

  return { getObjectPropertyById, getUserFullNameById };
};
