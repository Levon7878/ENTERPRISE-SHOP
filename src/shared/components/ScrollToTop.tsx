import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls window to top on every route change */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};
