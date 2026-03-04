import { List, ListItemButton, ListItemText } from '@mui/material'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

export const Sidebar = ({ categories, selected, onSelect }) => {
  return (
    <List disablePadding>
      {(categories || []).map((category) => (
        <ListItemButton
          key={category}
          selected={selected === category}
          onClick={() => onSelect(category)}
          sx={useStyles(styles, 'sidebar__item')}
        >
          <ListItemText
            primary={category}
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      ))}
    </List>
  )
}

