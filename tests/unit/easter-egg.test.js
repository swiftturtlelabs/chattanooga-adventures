import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTapTracker } from '../../js/home.js';

describe('createTapTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onActivate after threshold taps within time window', () => {
    const onActivate = vi.fn();
    const handleTap = createTapTracker(7, 3000, onActivate);

    vi.setSystemTime(1000);
    for (let i = 0; i < 7; i++) {
      handleTap();
    }

    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('does not activate with fewer than threshold taps', () => {
    const onActivate = vi.fn();
    const handleTap = createTapTracker(7, 3000, onActivate);

    vi.setSystemTime(1000);
    for (let i = 0; i < 6; i++) {
      handleTap();
    }

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('resets when time window expires between taps', () => {
    const onActivate = vi.fn();
    const handleTap = createTapTracker(7, 3000, onActivate);

    vi.setSystemTime(1000);
    for (let i = 0; i < 5; i++) {
      handleTap();
    }

    vi.setSystemTime(5000);
    handleTap();
    handleTap();

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('activates after a reset and a new complete sequence', () => {
    const onActivate = vi.fn();
    const handleTap = createTapTracker(7, 3000, onActivate);

    vi.setSystemTime(1000);
    for (let i = 0; i < 3; i++) {
      handleTap();
    }

    vi.setSystemTime(5000);
    for (let i = 0; i < 7; i++) {
      handleTap();
    }

    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('resets counter after successful activation', () => {
    const onActivate = vi.fn();
    const handleTap = createTapTracker(7, 3000, onActivate);

    vi.setSystemTime(1000);

    for (let i = 0; i < 7; i++) {
      handleTap();
    }
    expect(onActivate).toHaveBeenCalledOnce();

    for (let i = 0; i < 7; i++) {
      handleTap();
    }
    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it('works with a custom threshold of 3', () => {
    const onActivate = vi.fn();
    const handleTap = createTapTracker(3, 2000, onActivate);

    vi.setSystemTime(1000);
    handleTap();
    handleTap();
    handleTap();

    expect(onActivate).toHaveBeenCalledOnce();
  });
});
