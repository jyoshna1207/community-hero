// File path: src/constants/roles.js

export const ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  DEPARTMENT: 'department',
  ADMIN: 'admin',
  WARD_OFFICER: 'officer',
  DEPARTMENT_OFFICER: 'department',
  ADMINISTRATOR: 'admin',
};

export const ROLE_REDIRECTS = {
  [ROLES.CITIZEN]: '/dashboard',
  [ROLES.OFFICER]: '/officer/dashboard',
  [ROLES.DEPARTMENT]: '/department/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.WARD_OFFICER]: '/officer/dashboard',
  [ROLES.DEPARTMENT_OFFICER]: '/department/dashboard', // <--- Fixed the typo here
  [ROLES.ADMINISTRATOR]: '/admin/dashboard',
};