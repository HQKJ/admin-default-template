import { useEffect, FC } from 'react';
import { useRouteError } from 'react-router-dom';

/**
 * ErrorPage
 * @returns
 * */
const ErrorPage: FC = () => {
  const error: any = useRouteError();

  useEffect(() => {
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      window.location.reload();
    }
  }, [error]);
  return <></>;
};

export default ErrorPage;
