import { Typography } from '@mui/material'

export default function SectionTitle({ eyebrow, children }) {
  return (
    <>
      <Typography variant="overline" color="primary" component="p">
        {eyebrow}
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem' }, mb: 4 }}>
        {children}
      </Typography>
    </>
  )
}
