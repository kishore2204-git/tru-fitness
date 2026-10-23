import { Paper, Box, Typography } from '@mui/material';

export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderLeft: `4px solid ${color}`, '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 30px ${color}33` }, transition: 'all 0.2s' }}>
      <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon sx={{ fontSize: 28, color }} />
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
      </Box>
    </Paper>
  );
}
