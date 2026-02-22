import { describe, it, expect, vi } from 'vitest';

vi.mock('../../js/firebase-config.js', () => ({
  EMAILJS_CONFIG: {
    serviceId: 'test_service',
    templateId: 'test_template',
    publicKey: 'test_key',
  },
}));

import { validateForm } from '../../js/support.js';

describe('validateForm', () => {
  const validData = {
    from_name: 'Jane Doe',
    from_email: 'jane@example.com',
    subject: 'General',
    message: 'Hello, this is a test message.',
  };

  it('returns null for valid form data', () => {
    expect(validateForm(validData)).toBeNull();
  });

  it('returns error when name is empty', () => {
    const errors = validateForm({ ...validData, from_name: '' });
    expect(errors).toHaveProperty('from_name');
  });

  it('returns error when name is only whitespace', () => {
    const errors = validateForm({ ...validData, from_name: '   ' });
    expect(errors).toHaveProperty('from_name');
  });

  it('returns error when email is empty', () => {
    const errors = validateForm({ ...validData, from_email: '' });
    expect(errors).toHaveProperty('from_email');
  });

  it('returns error for invalid email format', () => {
    const errors = validateForm({ ...validData, from_email: 'not-an-email' });
    expect(errors).toHaveProperty('from_email');
  });

  it('returns error for email missing domain', () => {
    const errors = validateForm({ ...validData, from_email: 'user@' });
    expect(errors).toHaveProperty('from_email');
  });

  it('returns error when subject is empty', () => {
    const errors = validateForm({ ...validData, subject: '' });
    expect(errors).toHaveProperty('subject');
  });

  it('returns error when message is empty', () => {
    const errors = validateForm({ ...validData, message: '' });
    expect(errors).toHaveProperty('message');
  });

  it('returns error when message is only whitespace', () => {
    const errors = validateForm({ ...validData, message: '   ' });
    expect(errors).toHaveProperty('message');
  });

  it('returns multiple errors when multiple fields are invalid', () => {
    const errors = validateForm({
      from_name: '',
      from_email: '',
      subject: '',
      message: '',
    });
    expect(Object.keys(errors)).toHaveLength(4);
  });

  it('accepts email with subdomain', () => {
    const data = { ...validData, from_email: 'user@mail.example.com' };
    expect(validateForm(data)).toBeNull();
  });

  it('returns null for all fields missing (undefined input)', () => {
    const errors = validateForm({});
    expect(errors).not.toBeNull();
    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });
});
