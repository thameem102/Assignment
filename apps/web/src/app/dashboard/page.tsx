'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import { Product, Order } from '@/lib/types';

const SERVICE_URL = 'http://localhost:3003';

function StatusChip({ status }: { status: string }) {
  const styles =
    status === 'COMPLETED'
      ? 'bg-green-50 text-green-600 border-green-200'
      : status === 'PENDING'
        ? 'bg-amber-50 text-amber-600 border-amber-200'
        : status === 'FAILED'
          ? 'bg-red-50 text-red-600 border-red-200'
          : 'bg-gray-50 text-gray-500 border-gray-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md border ${styles}`}
    >
      {status}
    </span>
  );
}

function SectionCard({
  icon,
  overline,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  overline: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ animation: 'fadeUp 0.5s ease both' }}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-xs font-medium text-blue-500 tracking-wide uppercase">
            {overline}
          </span>
        </div>
        <h2
          className="text-xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-display), Syne, sans-serif' }}
        >
          {title}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm m-4">
      {message}
    </div>
  );
}

function InfoBanner({ message }: { message: string }) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm m-4">
      {message}
    </div>
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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Product[]>;
      })
      .then((data) => {
        setProducts(data);
        setProductsLoading(false);
      })
      .catch((err: Error) => {
        setProductsError(err.message ?? 'Failed to fetch');
        setProductsLoading(false);
      });

    fetch(`${SERVICE_URL}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Order[]>;
      })
      .then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      })
      .catch((err: Error) => {
        setOrdersError(err.message ?? 'Failed to fetch');
        setOrdersLoading(false);
      });
  }, [router]);

  return (
    <div
      className="flex flex-col gap-10"
      style={{ fontFamily: 'var(--font-body), Outfit, sans-serif' }}
    >
      {/* Products */}
      <SectionCard
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        }
        overline="Product Service"
        title="Products"
        subtitle="Live data from the Product Service microservice"
      >
        {productsLoading && <LoadingSpinner />}
        {productsError && (
          <ErrorBanner
            message={`Could not connect to Product Service: ${productsError}. Make sure services are running.`}
          />
        )}
        {!productsLoading && !productsError && products.length === 0 && (
          <InfoBanner message="No products yet. Create some via the Product Service." />
        )}
        {!productsLoading && !productsError && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {p.name}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-700"
                      style={{
                        fontFamily:
                          'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.82rem',
                      }}
                    >
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{p.stock}</td>
                    <td
                      className="px-4 py-3 text-gray-400 whitespace-nowrap"
                      style={{
                        fontFamily:
                          'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.75rem',
                      }}
                    >
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Orders */}
      <SectionCard
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        }
        overline="Order Service"
        title="Orders"
        subtitle="Live data from the Order Service microservice"
      >
        {ordersLoading && <LoadingSpinner />}
        {ordersError && (
          <ErrorBanner
            message={`Could not connect to Order Service: ${ordersError}. Make sure it is running on port 3003.`}
          />
        )}
        {!ordersLoading && !ordersError && orders.length === 0 && (
          <InfoBanner message="No orders yet. Create some via the Order Service." />
        )}
        {!ordersLoading && !ordersError && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Qty
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="px-4 py-3 text-gray-400 whitespace-nowrap"
                      style={{
                        fontFamily:
                          'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.75rem',
                      }}
                    >
                      {order.id.slice(0, 8)}&hellip;
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {order.product?.name ?? order.productId}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.quantity}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-700"
                      style={{
                        fontFamily:
                          'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.82rem',
                      }}
                    >
                      ${Number(order.totalPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={order.status} />
                    </td>
                    <td
                      className="px-4 py-3 text-gray-400 whitespace-nowrap"
                      style={{
                        fontFamily:
                          'var(--font-mono), JetBrains Mono, monospace',
                        fontSize: '0.75rem',
                      }}
                    >
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
