import { useEffect } from 'react';
const useMount = (cb: () => void) => {
  return useEffect(() => cb(), []);
};

export default useMount;
