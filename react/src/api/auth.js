const serverUrl = process.env.REACT_APP_SERVER_URL;
const serverPort = process.env.REACT_APP_SERVER_PORT;

const BASE_URL = `${serverUrl}:${serverPort}/api/auth`;

export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (firstName, username, password, deviceId) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST', // Change this to POST as needed
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, username, password, deviceId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkTokenValidity = async () => {
  try {
    const response = await fetch(`${BASE_URL}/isTokenValid`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('jwtToken'),
      },
    });

    if (response.status === 200) {
      // Token is valid
      return true;
    } else {
      // Token is not valid
      return false;
    }
  } catch (error) {
    console.error('Error checking token validity:', error);
    // Handle error (e.g., return false)
    return false;
  }
};
