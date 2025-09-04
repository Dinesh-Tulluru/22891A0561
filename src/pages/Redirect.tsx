import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { urlService } from '../utils/urlService';

export default function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error' | 'expired'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!shortCode) {
      setStatus('error');
      setErrorMessage('Invalid short code');
      return;
    }

    const urlData = urlService.getUrlByShortCode(shortCode);
    
    if (!urlData) {
      setStatus('error');
      setErrorMessage('Short URL not found');
      return;
    }

    if (urlService.isUrlExpired(urlData)) {
      setStatus('expired');
      setErrorMessage('This short URL has expired');
      return;
    }

    // Record the click
    urlService.recordClick(shortCode);
    
    setStatus('redirecting');
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = urlData.originalUrl;
    }, 2000);
  }, [shortCode]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      {status === 'loading' && (
        <Box>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Loading...</Typography>
        </Box>
      )}

      {status === 'redirecting' && (
        <Box>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Redirecting you now...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected to the original URL in a moment.
          </Typography>
        </Box>
      )}

      {(status === 'error' || status === 'expired') && (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
          <Typography variant="body2">
            Please check the URL and try again, or contact the person who shared this link.
          </Typography>
        </Box>
      )}
    </Container>
  );
}