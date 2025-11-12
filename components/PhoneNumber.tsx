'use client';

interface PhoneNumberProps {
  phoneNumber: string;
  className?: string;
}

/**
 * PhoneNumber component that ensures +966 is always on the right
 * regardless of language direction (RTL/LTR)
 * Uses dir="ltr" to keep the entire number in left-to-right format
 * which positions +966 on the right side in RTL contexts
 */
export default function PhoneNumber({ phoneNumber, className = '' }: PhoneNumberProps) {
  return (
    <span dir="ltr" className={`inline-block ${className}`}>
      {phoneNumber}
    </span>
  );
}

