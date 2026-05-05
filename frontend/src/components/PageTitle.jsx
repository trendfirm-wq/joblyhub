import { useEffect } from 'react';

export default function PageTitle({ title }) {
  useEffect(() => {
    const finalTitle = title ? `${title} | JoblyHub` : 'JoblyHub';
    document.title = finalTitle;
  }, [title]);

  return null;
}