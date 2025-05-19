import { useEffect, useState } from "react";
import axios from "axios";

/**
 * useFetchWithToken Hook
 * Fetches protected API data using the token from localStorage.
 *
 * @param {string} endpoint - API path (excluding base URL)
 * @returns {object} - { data, loading, error, refetch }
 */
const useFetchWithToken = (endpoint) => {
  const [data, setData] = useState(null); // holds the fetched data
  const [loading, setLoading] = useState(true); // indicates loading state
  const [error, setError] = useState(null); // holds any error occurred

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data?.data ?? []); // fallback to empty array if undefined
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchWithToken;
