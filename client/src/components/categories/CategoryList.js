import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";

export default function CategoryList({
  categories,
  selectedCategory,
  loading,
  onCategoryClick,
}) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Danh mục
      </Typography>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <List>
          {categories.map((cat) => (
            <ListItem key={cat.id} disablePadding>
              <ListItemButton
                selected={selectedCategory?.id === cat.id}
                onClick={() => onCategoryClick(cat)}
              >
                <ListItemText primary={cat.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}
