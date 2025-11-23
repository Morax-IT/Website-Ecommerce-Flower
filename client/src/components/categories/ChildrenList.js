import { List, ListItem, CircularProgress, Typography } from "@mui/material";

export default function ChildrenList({ selectedCategory, children, loading }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {selectedCategory ? `Loại: ${selectedCategory.name}` : "Chọn danh mục"}
      </Typography>

      {loading && <CircularProgress size={24} />}

      {!loading && children.length > 0 && (
        <List>
          {children.map((child) => (
            <ListItem key={child.id}>{child.name}</ListItem>
          ))}
        </List>
      )}
    </>
  );
}
