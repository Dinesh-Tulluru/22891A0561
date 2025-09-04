import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  Link
} from '@mui/material';
import { urlService, URLData } from '../utils/urlService';

interface URLFormProps {
  onUrlShortened: (urlData: URLData) => void;
}

export default function URLForm({ onUrlShortened }: URLFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [validityminutess, setValidityminutess] = useState('');
  const [error, setError] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<URLData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validity = validityminutess ? parseInt(validityminutess) : undefined;
    const result = urlService.shortenUrl(originalUrl, customCode || undefined, validity);

    if ('error' in result) {
      setError(result.error);
    } else {
      setShortenedUrl(result);
      onUrlShortened(result);
      setOriginalUrl('');
      setCustomCode('');
      setValidityminutess('');
    }
    setIsLoading(false);
  };

  const shortUrl = shortenedUrl ? `${window.location.origin}/s/${shortenedUrl.shortCode}` : '';

  return (
    <Card sx={{ mb: 2, border: '1px solid #ddd' }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Original URL"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              fullWidth
              placeholder="https://example.com"
              size="small"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Custom Shortcode (optional)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="mycode"
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Validity (minutes)"
                type="number"
                value={validityminutess}
                onChange={(e) => setValidityminutess(e.target.value)}
                placeholder="30"
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ alignSelf: 'flex-start' }}
            >
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>

            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            {shortenedUrl && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  URL Shortened Successfully!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2">Short URL:</Typography>
                  <Link href={shortUrl} target="_blank" rel="noopener">
                    {shortUrl}
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={`Code: ${shortenedUrl.shortCode}`} size="small" />
                  {shortenedUrl.validUntil && (
                    <Chip 
                      label={`Expires: ${shortenedUrl.validUntil.toLocaleDateString()}`} 
                      size="small" 
                      color="warning"
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}