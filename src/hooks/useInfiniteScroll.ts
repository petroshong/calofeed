import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  threshold?: number;
}

export const useInfiniteScroll = ({ hasNextPage, fetchNextPage, threshold = 100 }: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - threshold) {
      if (hasNextPage && !isFetching) {
        setIsFetching(true);
        fetchNextPage().finally(() => setIsFetching(false));
      }
    }
  }, [hasNextPage, isFetching, fetchNextPage, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isFetching };
};