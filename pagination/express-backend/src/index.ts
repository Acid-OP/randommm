import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

interface Product {
  id: number;
  name: string;
  price: number;
}
const PRODUCTS_DB: Product[] = [
  { id: 1, name: "Laptop (Express)", price: 1200 },
  { id: 2, name: "Mouse (Express)", price: 25 },
  { id: 3, name: "Keyboard (Express)", price: 75 },
  { id: 4, name: "Monitor (Express)", price: 300 },
  { id: 5, name: "Webcam (Express)", price: 50 },
  { id: 6, name: "Headphones (Express)", price: 150 },
  { id: 7, name: "Microphone (Express)", price: 100 },
  { id: 8, name: "Desk Lamp (Express)", price: 40 },
  { id: 9, name: "Chair (Express)", price: 400 },
  { id: 10, name: "External SSD (Express)", price: 180 },
  { id: 11, name: "USB Hub (Express)", price: 30 },
  { id: 12, name: "Printer (Express)", price: 250 },
  { id: 13, name: "Router (Express)", price: 90 },
  { id: 14, name: "Smart Speaker (Express)", price: 70 },
  { id: 15, name: "Gaming Console (Express)", price: 500 },
  { id: 16, name: "Drawing Tablet (Express)", price: 120 },
  { id: 17, name: "VR Headset (Express)", price: 700 },
  { id: 18, name: "Smartwatch (Express)", price: 200 },
  { id: 19, name: "Fitness Tracker (Express)", price: 80 },
  { id: 20, name: "Power Bank (Express)", price: 45 },
];

app.get('/api/products', (req: Request, res: Response) => {

  const pageSize = parseInt(req.query.pageSize as string || '5', 10);
  const lastId = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;

  const actualPageSize = Math.max(1, Math.min(pageSize, 20));

  let startIndex = 0;

  if (lastId === undefined) {
    startIndex = 0;
  } else {
    const lastProductIndex = PRODUCTS_DB.findIndex(product => product.id === lastId);
    if (lastProductIndex !== -1) {
      startIndex = lastProductIndex + 1;
    } else {
      console.warn(`Warning: Cursor ${lastId} not found. Starting from beginning.`);
      startIndex = 0;
    }
  }

  const productsWithExtra = PRODUCTS_DB.slice(startIndex, startIndex + actualPageSize + 1);

  const hasMore = productsWithExtra.length > actualPageSize;
  
  const productsToReturn = productsWithExtra.slice(0, actualPageSize);

  const nextCursor = productsToReturn.length > 0 ? productsToReturn[productsToReturn.length - 1].id : undefined;

  res.json({
    products: productsToReturn,
    nextCursor: nextCursor,
    hasMore: hasMore,
  });
});

app.listen(PORT, () => {
  console.log(`Express backend running on http://localhost:${PORT}`);
});

