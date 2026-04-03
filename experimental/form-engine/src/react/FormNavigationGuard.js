/**
 * FormNavigationGuard - Component for blocking navigation when form has unsaved changes
 *
 * Based on stripes-final-form's StripesFinalFormWrapper navigation check logic.
 * Blocks navigation when form is dirty and hasn't been successfully submitted.
 *
 * Default behavior: blocks when `dirty && !submitSucceeded && !submitting`.
 * Custom behavior: pass `shouldBlockNavigation` — its boolean return value is the
 * entire decision; no additional guards are applied on top.
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
 *
 * @example
 * ```jsx
 * // Use custom logic to determine if navigation should be blocked
 * <FormNavigationGuard
 *   history={history}
 *   shouldBlockNavigation={(engine) => {
 *     const formState = engine.getFormState();
 *     // Block only if 'name' field is dirty, ignore other fields
 *     return formState.values.name !== formState.initialValues.name;
 *   }}
 * />
 * ```
 */

import PropTypes from 'prop-types';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useFormState } from './hooks/useFormState';
import { useFormEngine } from './FormContext';
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
  shouldBlockNavigation = null,
}) {
  const hasCustomLogic = typeof shouldBlockNavigation === 'function';

  const engine = useFormEngine();
  // Subscribe only to the fields each path actually needs:
  const formState = useFormState({
    dirty: !hasCustomLogic,
    submitting: !hasCustomLogic,
    submitSucceeded: !hasCustomLogic,
  });

  const [openModal, setOpenModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const unblockRef = useRef(null);
  const isMountedRef = useRef(true);

  const { dirty, submitting, submitSucceeded } = formState;

  // Refs that are written every render so the history.block callback always
  // reads current values without the effect needing to re-register on each change.
  const getShouldPromptRef = useRef(null);

  getShouldPromptRef.current = hasCustomLogic
    ? () => Boolean(shouldBlockNavigation(engine))
    : () => dirty && !submitSucceeded && !submitting;

  const onBeforeBlockRef = useRef(onBeforeBlock);

  onBeforeBlockRef.current = onBeforeBlock;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Set up navigation blocking.
  // Structural deps only (enabled, history, ignorePaths) — all form-state values
  // are read via refs so re-registering history.block is not needed on every
  // formState change.
  useEffect(() => {
    if (!enabled || !history?.block) {
      return undefined;
    }

    unblockRef.current = history.block((location) => {
      // Ignore navigation to specified paths (e.g., /logout)
      if (ignorePaths.some(path => location.pathname.startsWith(path))) {
        return true;
      }

      // Custom path: the callback is the sole authority — its result is used as-is.
      // Default path: block when dirty but not yet submitted or currently submitting.
      const shouldPrompt = getShouldPromptRef.current();

      if (shouldPrompt) {
        if (onBeforeBlockRef.current) {
          onBeforeBlockRef.current(location);
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
  }, [enabled, history, ignorePaths]);

  const handleConfirm = () => {
    setOpenModal(false);

    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!nextLocation) {
      setOpenModal(false);

      // Pass null explicitly so consumers always receive the same argument shape:
      // onCancel(location | null) — matches the with-location branch below.
      if (onCancel) {
        onCancel(null);
      }

      return;
    }

    const { pathname, search } = nextLocation;

    // Unblock navigation and null the ref immediately to prevent the effect
    // cleanup from calling the unblock function a second time.
    if (unblockRef.current) {
      unblockRef.current();
      unblockRef.current = null;
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
   * Optional callback to cache previous URL (integrates with LastVisitedContext.cachePreviousUrl)
   */
  cachePreviousUrl: PropTypes.func,
  /**
   * Label for cancel button - navigates away (default: "Close Without Saving")
   */
  cancelLabel: PropTypes.node,
  /**
   * Label for confirm button - stays on page (default: "Keep Editing")
   */
  confirmLabel: PropTypes.node,
  /**
   * Enable or disable navigation guard
   */
  enabled: PropTypes.bool,
  /**
   * Heading for confirmation modal
   */
  heading: PropTypes.node,
  /**
   * History object from react-router (must have block and push methods)
   */
  history: PropTypes.shape({
    block: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }),
  /**
   * Paths to ignore when blocking navigation (e.g., ['/logout'])
   */
  ignorePaths: PropTypes.arrayOf(PropTypes.string),
  /**
   * Message to display in confirmation modal
   */
  message: PropTypes.node,
  /**
   * Callback called when user cancels (navigates away)
   * @param {Object|null} location - The location being navigated to, or null if none
   */
  onCancel: PropTypes.func,
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
   * Custom function to determine if navigation should be blocked.
   * Receives FormEngine instance and returns boolean.
   * Its return value is the complete decision — no other guards are applied.
   * When omitted, the default logic applies: block when dirty and not yet submitted.
   *
   * @param {FormEngine} engine - FormEngine instance with getFormState() method to access form state
   * @returns {boolean} true to block navigation, false to allow
   *
   * @example
   * shouldBlockNavigation={(engine) => {
   *   return engine.getFormState().values.primaryName !== engine.getFormState().initialValues.primaryName;
   * }}
   */
  shouldBlockNavigation: PropTypes.func,
};
