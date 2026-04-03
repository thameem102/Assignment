'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { getCurrentUser } from '@/lib/localStorage';
import { Product, Order } from '@/lib/types';

const SERVICE_URL = 'http://localhost:3003';

function StatusChip({ status }: { status: string }) {
  const color =
    status === 'COMPLETED' ? 'success' :
    status === 'PENDING' ? 'warning' :
    status === 'FAILED' ? 'error' : 'default';
  return <Chip label={status} color={color as 'success' | 'warning' | 'error' | 'default'} size="small" />;
}

function SectionCard({
  accent,
  overline,
  title,
  subtitle,
  children,
}: {
  accent: string;
  overline: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ animation: 'fadeUp 0.5s ease both' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: accent, display: 'block', mb: 0.5 }}>
          {overline}
        </Typography>
        <Typography variant="h5" sx={{ color: '#e2e2f0', fontWeight: 700, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6a6a88' }}>
          {subtitle}
        </Typography>
      </Box>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 2, sm: 4 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${accent}, #818cf8)`,
            zIndex: 1,
          },
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
      return;
    }

    fetch(`${SERVICE_URL}/products`)
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<Product[]>; })
      .then((data) => { setProducts(data); setProductsLoading(false); })
      .catch((err: Error) => { setProductsError(err.message ?? 'Failed to fetch'); setProductsLoading(false); });

    fetch(`${SERVICE_URL}/orders`)
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<Order[]>; })
      .then((data) => { setOrders(data); setOrdersLoading(false); })
      .catch((err: Error) => { setOrdersError(err.message ?? 'Failed to fetch'); setOrdersLoading(false); });
  }, [router]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Products */}
      <SectionCard
        accent="#22d3ee"
        overline="Product Service · :5001 (via :3003)"
        title="Products"
        subtitle="Live data from the Product Service microservice"
      >
        {productsLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        )}
        {productsError && (
          <Alert severity="error">
            Could not connect to Product Service: {productsError}. Make sure services are running.
          </Alert>
        )}
        {!productsLoading && !productsError && products.length === 0 && (
          <Alert severity="info">No products yet. Create some via the Product Service.</Alert>
        )}
        {!productsLoading && !productsError && products.length > 0 && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell
                      sx={{ fontFamily: 'var(--font-mono), JetBrains Mono, monospace', fontSize: '0.82rem' }}
                    >
                      ${Number(p.price).toFixed(2)}
                    </TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.75rem',
                        color: '#6a6a88',
                      }}
                    >
                      {new Date(p.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </SectionCard>

      {/* Orders */}
      <SectionCard
        accent="#818cf8"
        overline="Order Service · :3003"
        title="Orders"
        subtitle="Live data from the Order Service microservice"
      >
        {ordersLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        )}
        {ordersError && (
          <Alert severity="error">
            Could not connect to Order Service: {ordersError}. Make sure it is running on port 3003.
          </Alert>
        )}
        {!ordersLoading && !ordersError && orders.length === 0 && (
          <Alert severity="info">No orders yet. Create some via the Order Service.</Alert>
        )}
        {!ordersLoading && !ordersError && orders.length > 0 && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell
                      sx={{
                        fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.75rem',
                        color: '#6a6a88',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {order.id.slice(0, 8)}&hellip;
                    </TableCell>
                    <TableCell>{order.product?.name ?? order.productId}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell
                      sx={{ fontFamily: 'var(--font-mono), JetBrains Mono, monospace', fontSize: '0.82rem' }}
                    >
                      ${Number(order.totalPrice).toFixed(2)}
                    </TableCell>
                    <TableCell><StatusChip status={order.status} /></TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.75rem',
                        color: '#6a6a88',
                      }}
                    >
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </SectionCard>
    </Box>
  );
}
