import ProductForm from "../../components/products/ProductForm";

const ProductCreatePage = () => {
  return (
    <ProductForm
      mode="create"
      onSuccess={() => (window.location.href = "/admin/products")}
    />
  );
};

export default ProductCreatePage;
