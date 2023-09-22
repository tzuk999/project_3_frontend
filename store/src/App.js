import { useEffect } from 'react';
import Navbar from './components/Navbar';
import axios from 'axios';

function App() {
  const refreshAccessToken = () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      return Promise.reject(new Error('No refresh token available.'));
    }
  
    return axios
      .post(
        'http://127.0.0.1:8000/refresh-token/',
        { refresh_token },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log(response);
        const newAccessToken = response.data.access_token;
        localStorage.setItem('access_token', newAccessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return newAccessToken;
      })
      .catch((error) => {
        localStorage.removeItem('access_token');
        return Promise.reject(error);
      });
  };
  

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const access_token = localStorage.getItem('access_token');

if (access_token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
}

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshAccessToken()
        .then((newAccessToken) => {
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        })
        .catch((error) => {
          clearInterval(refreshInterval);
        });
    }, 15 * 60 * 1000); 
  
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <>
    <div>
      <Navbar/>
    </div>
    </>
  );
}

export default App;
