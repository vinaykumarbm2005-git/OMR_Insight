import { ROUTES } from './routes';
import { MdDashboard, MdCreate, MdDocumentScanner, MdAssessment } from 'react-icons/md';

export const NAVIGATION = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: MdDashboard },
  { label: 'Create Exam', path: ROUTES.CREATE_EXAM, icon: MdCreate },
  { label: 'Live Scanner', path: ROUTES.SCANNER, icon: MdDocumentScanner },
  { label: 'Results', path: ROUTES.RESULTS, icon: MdAssessment },
];
