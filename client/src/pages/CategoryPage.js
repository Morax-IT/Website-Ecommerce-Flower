import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import CategoryList from "../components/categories/CategoryList";
import ChildrenList from "../components/categories/ChildrenList";
import {
  fetchChildrenCategories,
  fetchLevelOneCategories,
} from "../services/categoryService";

export default function CategoryPage() {
  const [levelOne, setLevelOne] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchLevelOne = async () => {
      setLoading(true);
      try {
        const categories = await fetchLevelOneCategories();
        setLevelOne(categories);
      } catch (err) {
        console.error("Failed to fetch level 1 categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelOne();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoadingChildren(true);
    try {
      const childrens = await fetchChildrenCategories(category.category_type);
      setChildren(childrens);
    } catch (err) {
      console.error("Failed to fetch children categories", err);
    } finally {
      setLoadingChildren(false);
    }
  };

  return (
    <Box display="flex" p={2} gap={2}>
      <Box flex={1} borderRight="1px solid #ddd" pr={2}>
        <CategoryList
          categories={levelOne}
          selectedCategory={selectedCategory}
          loading={loading}
          onCategoryClick={handleCategoryClick}
        />
      </Box>

      <Box flex={2}>
        <ChildrenList
          selectedCategory={selectedCategory}
          children={children}
          loading={loadingChildren}
        />
      </Box>
    </Box>
  );
}
