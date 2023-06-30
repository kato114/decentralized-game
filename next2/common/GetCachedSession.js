const getCachedSession = userAddress => {
  // if userAddress is not provided, get most recent session
  // otherwise, get session for user with that address
  let cachedSession = {
    userAddress: null,
    token: null,
    expiration: null,
    dclIdentity: null
  };

  // remove expired sessions
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('session-0x')) {
      const value = localStorage.getItem(key);
      if (value) {
        const session = JSON.parse(value);
        if (new Date(session.expiration) < new Date()) {
          localStorage.removeItem(key);
        }
      }
    }
  });

  Object.keys(localStorage).forEach(key => {
    if (userAddress ? key === `session-${userAddress}` : key.startsWith('session-0x')) {
      const value = localStorage.getItem(key);
      if (value) {
        const parsed = JSON.parse(value);
        // store most recent session
        if (cachedSession.expiration === null || parsed.expiration > cachedSession.expiration) {
          cachedSession = parsed;
        }
      }
    }
  });
  return cachedSession;
};

export default getCachedSession;
