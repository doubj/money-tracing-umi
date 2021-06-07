import { useState } from 'react';
type State<T> = {
  error: Error | null;
  data: T | null;
  status: 'idle' | 'loading' | 'error' | 'success';
};

const defaultState: State<null> = {
  error: null,
  data: null,
  status: 'idle',
};

const useAsync = <T>(initState?: State<T>) => {
  const [state, setState] = useState({
    ...defaultState,
    ...initState,
  });

  const setData = (data: T) => {
    setState({ data, status: 'success', error: null });
  };

  const setError = (error: Error) => {
    setState({ data: null, status: 'error', error });
  };

  const run = async (promise: Promise<T>) => {
    if (!promise || !promise.then) {
      throw new Error('请传入正确的Promise参数');
    }
    setState({ ...state, status: 'loading' });
    return promise.then((data) => {
      setData(data);
      return data;
    });
  };

  return {
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    run,
    setData,
    setError,
    ...state,
  };
};

export default useAsync;
