import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Shorten URLs
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/statistics"
            variant={location.pathname === '/statistics' ? 'outlined' : 'text'}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}