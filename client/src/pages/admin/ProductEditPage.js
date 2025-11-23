import ProductForm from "../../components/products/ProductForm";
import { useParams } from "react-router-dom";

const ProductEditPage = () => {
  const { id } = useParams();
  return (
    <ProductForm
      mode="edit"
      productId={id}
      onSuccess={() => alert("Sửa thành công")}
    />
  );
};

export default ProductEditPage;
