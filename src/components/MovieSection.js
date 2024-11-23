import React from 'react';
import HorizontalScrollCard from './HorizontalScrollCard';
import useFetch from '../hooks/useFetch';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const MovieSection = ({ endpoint, title }) => {
  const { data, loading, error } = useFetch(endpoint);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <HorizontalScrollCard 
      data={data} 
      heading={title}
    />
  );
};

export default MovieSection;