import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import Navigation from '../components/Navigation';
import { urlService, URLData } from '../utils/urlService';

export default function Statistics() {
  const [urls, setUrls] = useState<URLData[]>([]);

  useEffect(() => {
    const loadUrls = () => {
      const allUrls = urlService.getAllUrls();
      setUrls(allUrls);
    };
    
    loadUrls();
    // Refresh data every 5 seconds to catch new clicks
    const interval = setInterval(loadUrls, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);

  if (urls.length === 0) {
    return (
      <>
        <Navigation />
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            URL Statistics
          </Typography>
          <Alert severity="info">
            No shortened URLs found. Create some URLs first to see statistics here.
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          URL Statistics Dashboard
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Card sx={{ minWidth: 150, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h4" color="primary">
                {urls.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 150, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h4" color="secondary">
                {totalClicks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Typography variant="h5" gutterBottom>
          All Shortened URLs
        </Typography>

        {urls.map((url) => {
          const isExpired = urlService.isUrlExpired(url);
          const shortUrl = `${window.location.origin}/s/${url.shortCode}`;
          
          return (
            <Card key={url.id} sx={{ mb: 3, border: isExpired ? '1px solid #f44336' : '1px solid #ddd' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ wordBreak: 'break-all' }}>
                    {url.originalUrl}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body2">Short URL:</Typography>
                    <Link href={shortUrl} target="_blank" rel="noopener">
                      {shortUrl}
                    </Link>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={`${url.clicks.length} clicks`} color="primary" size="small" />
                    <Chip label={`Created: ${url.createdAt.toLocaleDateString()}`} size="small" />
                    {url.validUntil && (
                      <Chip 
                        label={`Expires: ${url.validUntil.toLocaleDateString()}`} 
                        color={isExpired ? 'error' : 'warning'} 
                        size="small" 
                      />
                    )}
                    {isExpired && <Chip label="EXPIRED" color="error" size="small" />}
                  </Box>
                </Box>

                {url.clicks.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Click Details:
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>User Agent</TableCell>
                            <TableCell>Referrer</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {url.clicks.slice().reverse().map((click, index) => (
                            <TableRow key={index}>
                              <TableCell>{click.timestamp.toLocaleString()}</TableCell>
                              <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {click.userAgent.substring(0, 50)}...
                              </TableCell>
                              <TableCell>{click.referrer}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {url.clicks.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No clicks yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </>
  );
}