import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css'; // Assuming you'll update or create App.css for basic styling

interface Product {
  id: number;
  name: string;
  price: number;
}

const API_PATH = '/api/products';
const PAGE_SIZE = 5; // Number of items to fetch per request

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const didInitialFetchRef = useRef(false);

  const fetchProducts = async (cursor: number | undefined) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, number> = { pageSize: PAGE_SIZE };
      if (cursor !== undefined) params.cursor = cursor;

      const response = await axios.get<{
        products: Product[];
        nextCursor?: number;
        hasMore: boolean;
      }>(API_PATH, { params });
      const data = response.data;
      
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (e: any) {
      // axios puts HTTP error details on `e.response`
      const maybeStatus = e?.response?.status;
      const maybeStatusText = e?.response?.statusText;
      setError(
        "Failed to fetch products: " +
          (maybeStatus ? `[${maybeStatus}${maybeStatusText ? ` ${maybeStatusText}` : ''}] ` : '') +
          (e?.message ?? 'Unknown error')
      );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // In React StrictMode (dev), effects may run twice on mount.
    // This guard prevents fetching the first page twice and confusing pagination state.
    if (didInitialFetchRef.current) return;
    didInitialFetchRef.current = true;
    fetchProducts(undefined); // Fetch initial products when component mounts
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchProducts(nextCursor);
    }
  };

  return (
    <div className="container">
      <h1>Product List (Cursor-based Pagination - React TS)</h1>
      <div className="product-list">
        {products.length === 0 && !loading && !error && (
          <p>No products to display.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
      
      {loading && <p className="loading">Loading more products...</p>}
      {error && <p className="error">{error}</p>}

      {hasMore && !loading && (
        <button onClick={handleLoadMore} className="load-more-button">
          Load More
        </button>
      )}
      {!hasMore && products.length > 0 && !loading && (
        <p className="no-more">No more products to load.</p>
      )}
    </div>
  );
}

export default App;
