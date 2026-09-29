import { validateName } from './validateName';

describe('validateName', () => {
  it('returns no errors when name is present and within length limit', () => {
    const errors = validateName({ name: 'Discovery layer' });

    expect(errors).toEqual({});
  });

  it('returns a "blank" error when name is an empty string', () => {
    const errors = validateName({ name: '' });

    expect(errors.name.props.id).toBe('stripes-acq-components.validation.customLink.nameBlank');
  });

  it('returns a "name too long" error when name exceeds 150 characters', () => {
    const errors = validateName({ name: 'a'.repeat(151) });

    expect(errors.name.props.id).toBe('stripes-acq-components.validation.customLink.nameTooLong');
  });

  it('returns no errors when name is exactly 150 characters', () => {
    const errors = validateName({ name: 'a'.repeat(150) });

    expect(errors).toEqual({});
  });
});
