/**
 * FormNavigationGuard - Component for blocking navigation when form has unsaved changes
 *
 * Based on stripes-final-form's StripesFinalFormWrapper navigation check logic.
 * Blocks navigation when form is dirty and hasn't been successfully submitted.
 *
 * @example
 * ```jsx
 * import { Form, FormNavigationGuard } from '@folio/stripes-acq-components/experimental';
 * import { useHistory } from 'react-router-dom';
 * import { ConfirmationModal } from '@folio/stripes-components';
 *
 * function MyForm() {
 *   const history = useHistory();
 *
 *   return (
 *     <Form onSubmit={handleSubmit}>
 *       <FormNavigationGuard
 *         history={history}
 *         ConfirmationModal={ConfirmationModal}
 *       />
 *     </Form>
 *   );
 * }
 * ```
 */

import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';

import { useFormState } from './hooks/useFormState';
import { FormNavigationModal } from './FormNavigationModal';

const DEFAULT_IGNORE_PATHS = ['/logout'];

export function FormNavigationGuard({
  history,
  enabled = true,
  message,
  heading,
  confirmLabel,
  cancelLabel,
  ignorePaths = DEFAULT_IGNORE_PATHS,
  onBeforeBlock,
  onConfirm,
  onCancel,
  cachePreviousUrl,
}) {
  const formState = useFormState({
    dirty: true,
    submitting: true,
    submitSucceeded: true,
  });

  const [openModal, setOpenModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const unblockRef = useRef(null);
  const isMountedRef = useRef(true);

  // Track form state for navigation blocking logic
  const { dirty, submitting, submitSucceeded } = formState;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Set up navigation blocking
  useEffect(() => {
    if (!enabled || !history?.block) {
      return undefined;
    }

    unblockRef.current = history.block((location) => {
      // Ignore navigation to specified paths (e.g., /logout)
      if (ignorePaths.some(path => location.pathname.startsWith(path))) {
        return true;
      }

      const shouldPrompt = dirty && !submitSucceeded && !submitting;

      if (shouldPrompt) {
        // Call optional callback before blocking
        if (onBeforeBlock) {
          onBeforeBlock(location);
        }

        if (isMountedRef.current) {
          setNextLocation(location);
          setOpenModal(true);
        }
      }

      return !shouldPrompt;
    });

    return () => {
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
    };
  }, [enabled, history, dirty, submitSucceeded, submitting, ignorePaths, onBeforeBlock]);

  const handleConfirm = () => {
    setOpenModal(false);

    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!nextLocation) {
      setOpenModal(false);

      if (onCancel) {
        onCancel();
      }

      return;
    }

    const { pathname, search } = nextLocation;

    // Unblock navigation
    if (unblockRef.current) {
      unblockRef.current();
    }

    // Cache previous URL if provided (LastVisitedContext integration)
    if (typeof cachePreviousUrl === 'function') {
      try {
        cachePreviousUrl();
      } catch (e) {
        // Ignore cache errors - not critical for navigation
        // eslint-disable-next-line no-console
        console.debug('Failed to cache previous URL:', e);
      }
    }

    // Navigate to the blocked location
    history.push(`${pathname}${search}`);

    setOpenModal(false);
    setNextLocation(null);

    if (onCancel) {
      onCancel(nextLocation);
    }
  };

  return (
    <FormNavigationModal
      open={openModal}
      message={message}
      heading={heading}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
    />
  );
}

FormNavigationGuard.propTypes = {
  /**
   * History object from react-router (must have block and push methods)
   */
  history: PropTypes.shape({
    block: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }),
  /**
   * Enable or disable navigation guard
   */
  enabled: PropTypes.bool,
  /**
   * Message to display in confirmation modal
   */
  message: PropTypes.node,
  /**
   * Heading for confirmation modal
   */
  heading: PropTypes.node,
  /**
   * Label for confirm button (e.g., "Keep Editing")
   */
  confirmLabel: PropTypes.node,
  /**
   * Label for cancel button (e.g., "Close Without Saving")
   */
  cancelLabel: PropTypes.node,
  /**
   * Paths to ignore when blocking navigation (e.g., ['/logout'])
   */
  ignorePaths: PropTypes.arrayOf(PropTypes.string),
  /**
   * Callback called before blocking navigation
   * @param {Object} location - The location that would be navigated to
   */
  onBeforeBlock: PropTypes.func,
  /**
   * Callback called when user confirms (stays on page)
   */
  onConfirm: PropTypes.func,
  /**
   * Callback called when user cancels (navigates away)
   * @param {Object} location - The location being navigated to (if available)
   */
  onCancel: PropTypes.func,
  /**
   * Optional callback to cache previous URL (integrates with LastVisitedContext.cachePreviousUrl)
   */
  cachePreviousUrl: PropTypes.func,
};
