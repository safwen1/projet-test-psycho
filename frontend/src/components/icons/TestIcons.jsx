import React from 'react';
import PropTypes from 'prop-types';
import { SvgIcon } from '@mui/material';

export const PersonalityIcon = ({ color = '#4298B4', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
      fill={color}
    />
  </svg>
);

export const EmotionalIcon = ({ color = '#33A474', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7 9.5C7 8.67 7.67 8 8.5 8C9.33 8 10 8.67 10 9.5C10 10.33 9.33 11 8.5 11C7.67 11 7 10.33 7 9.5ZM14.77 17.3C14.13 17.7 13.4 17.88 12.65 17.88C11.9 17.88 11.17 17.7 10.53 17.3C9.89 16.9 9.38 16.36 9.05 15.68L10.36 14.97C10.57 15.39 10.88 15.73 11.26 15.97C11.64 16.21 12.12 16.34 12.65 16.34C13.18 16.34 13.66 16.21 14.04 15.97C14.42 15.73 14.73 15.39 14.94 14.97L16.25 15.68C15.92 16.36 15.41 16.9 14.77 17.3ZM15.5 11C14.67 11 14 10.33 14 9.5C14 8.67 14.67 8 15.5 8C16.33 8 17 8.67 17 9.5C17 10.33 16.33 11 15.5 11Z"
      fill={color}
    />
  </svg>
);

export const CognitiveIcon = ({ color = '#2196f3', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7ZM17 17H7V15C7 13.34 10.33 12 12 12C13.67 12 17 13.34 17 15V17ZM6 13L4 9L8 11L6 13ZM20 9L18 13L16 11L20 9Z"
      fill={color}
    />
  </svg>
);

export const GcbsIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </SvgIcon>
);

export const AmbiIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z" />
  </SvgIcon>
);

export const RiasecIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 16h10.54l1.25-1.67L11.46 16H21l-7-9.33L14 6zm-1.56 4.15l.58-.77L11.75 8l-.58.77 1.27 1.38z" />
  </SvgIcon>
);

export const BigFiveIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fill={color}
    />
    <path
      d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
      fill={color}
    />
    <path
      d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
      fill={color}
    />
  </svg>
);

PersonalityIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

EmotionalIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

CognitiveIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

export const TestIcons = {
  personality: PersonalityIcon,
  emotional: EmotionalIcon,
  cognitive: CognitiveIcon,
  gcbs: GcbsIcon,
  ambi: AmbiIcon,
  riasec: RiasecIcon,
  bigFive: BigFiveIcon
}; 