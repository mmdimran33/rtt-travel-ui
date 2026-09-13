import { Box, Card, CardContent, Typography } from "@mui/material";

const VendorHome = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vendor Home
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">
            Welcome to Vendor Portal
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            You have access to the Vendor module only.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorHome;