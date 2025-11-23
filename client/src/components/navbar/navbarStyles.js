export const appBarStyle = {
  backgroundColor: "#f8f9fa",
  boxShadow: "none",
  borderBottom: "1px solid #ddd",
  px: 2,
};

export const toolbarStyle = {
  display: "flex",
  justifyContent: "space-between",
};

export const tabsWrapperStyle = {
  bgcolor: "#f1f3f6",
  p: 0.5,
  borderRadius: "12px",
};

export const tabsStyle = {
  minHeight: "40px",
  "& .MuiTab-root": {
    textTransform: "none",
    color: "#344767",
    minWidth: "120px",
    fontWeight: 500,
    zIndex: 1,
  },
  "& .Mui-selected": {
    color: "#344767",
  },
};

export const tabIndicatorStyle = {
  height: "100%",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
};

export const searchBoxStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: "4px 8px",
  borderRadius: "8px",
  width: "200px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};
