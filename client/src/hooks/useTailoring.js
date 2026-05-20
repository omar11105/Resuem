import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import api, { getApiBaseUrl, getAuthHeaders } from '../lib/api';

export function useTailoring() {
  const { getToken, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tailor = useCallback(
    async ({ resumeText, resumeFile, jobDescription, sections }) => {
      if (!isSignedIn) {
        setError('Please sign in to tailor your resume');
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const authHeaders = await getAuthHeaders();
        let response;

        if (resumeFile) {
          const formData = new FormData();
          formData.append('resume', resumeFile);
          formData.append('jobDescription', jobDescription);
          formData.append('sections', JSON.stringify(sections));

          const base = getApiBaseUrl();
          response = await axios.post(`${base}/api/tailor`, formData, {
            headers: authHeaders,
          });
        } else {
          response = await api.post('/tailor', {
            resumeText,
            jobDescription,
            sections,
          });
        }

        setResult(response.data);
        return response.data;
      } catch (err) {
        const message = err.response?.data?.error ?? err.message;
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isSignedIn, getToken]
  );

  return { tailor, loading, result, error, setResult };
}
