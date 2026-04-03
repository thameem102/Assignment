'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import { Product } from '@/lib/types';

const SERVICE_URL = 'http://localhost:3003';

interface CartItem {
  product: Product;
  quantity: number;
}

interface HeldCart {
  id: string;
  items: CartItem[];
  timestamp: string;
}

const HELD_CARTS_KEY = 'held_carts';

function getHeldCarts(): HeldCart[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HELD_CARTS_KEY);
    return raw ? (JSON.parse(raw) as HeldCart[]) : [];
  } catch {
    return [];
  }
}

function saveHeldCarts(carts: HeldCart[]) {
  localStorage.setItem(HELD_CARTS_KEY, JSON.stringify(carts));
}

// ─── Product Card ────────────────────────────────────────────────────
function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <button
      onClick={() => onAdd(product)}
      className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer w-full"
    >
      {/* Placeholder image */}
      <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:stroke-blue-400 transition-colors"
        >
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-800 truncate">
        {product.name}
      </h3>
      <p
        className="text-sm font-bold text-gray-900 mt-1"
        style={{ fontFamily: 'var(--font-mono), JetBrains Mono, monospace' }}
      >
        ${Number(product.price).toFixed(2)}
      </p>
      <p className="text-xs text-green-600 mt-0.5 font-medium">
        {product.stock} in stock
      </p>
    </button>
  );
}

// ─── Cart Item Row ───────────────────────────────────────────────────
function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {item.product.name}
        </p>
        <p
          className="text-xs text-gray-500"
          style={{ fontFamily: 'var(--font-mono), JetBrains Mono, monospace' }}
        >
          ${Number(item.product.price).toFixed(2)} each
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onDecrease}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          -
        </button>
        <span
          className="w-8 text-center text-sm font-semibold text-gray-800"
          style={{ fontFamily: 'var(--font-mono), JetBrains Mono, monospace' }}
        >
          {item.quantity}
        </span>
        <button
          onClick={onIncrease}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <p
        className="w-20 text-right text-sm font-semibold text-gray-800"
        style={{ fontFamily: 'var(--font-mono), JetBrains Mono, monospace' }}
      >
        ${(Number(item.product.price) * item.quantity).toFixed(2)}
      </p>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Retail Page ────────────────────────────────────────────────
export default function RetailPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [showHoldList, setShowHoldList] = useState(false);
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([]);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Counter for invoice number
  const [invoiceNum] = useState(
    () => Math.floor(Math.random() * 900) + 100
  );

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
      return;
    }

    setHeldCarts(getHeldCarts());

    fetch(`${SERVICE_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Product[]>;
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message ?? 'Failed to fetch');
        setLoading(false);
      });
  }, [router]);

  // Filtered products
  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCheckoutDone(false);
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQty = (productId: string) => {
    setCart((prev) =>
      prev.map((c) =>
        c.product.id === productId
          ? { ...c, quantity: c.quantity + 1 }
          : c
      )
    );
  };

  const decreaseQty = (productId: string) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCheckoutDone(false);
  };

  // Hold cart
  const holdCart = () => {
    if (cart.length === 0) return;
    const newHeld: HeldCart = {
      id: `SI-${invoiceNum}-${Date.now()}`,
      items: [...cart],
      timestamp: new Date().toISOString(),
    };
    const updated = [newHeld, ...heldCarts];
    setHeldCarts(updated);
    saveHeldCarts(updated);
    setCart([]);
  };

  // Restore held cart
  const restoreHeld = (heldId: string) => {
    const held = heldCarts.find((h) => h.id === heldId);
    if (!held) return;
    setCart(held.items);
    const updated = heldCarts.filter((h) => h.id !== heldId);
    setHeldCarts(updated);
    saveHeldCarts(updated);
    setShowHoldList(false);
  };

  const removeHeld = (heldId: string) => {
    const updated = heldCarts.filter((h) => h.id !== heldId);
    setHeldCarts(updated);
    saveHeldCarts(updated);
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutDone(true);
    setCart([]);
  };

  // Totals
  const subtotal = cart.reduce(
    (sum, c) => sum + Number(c.product.price) * c.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div
      className="flex h-[calc(100vh-56px-64px)] gap-6"
      style={{ fontFamily: 'var(--font-body), Outfit, sans-serif' }}
    >
      {/* ── Left: Products ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Product count */}
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-display), Syne, sans-serif' }}
          >
            All Products
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              Could not load products: {error}. Make sure services are running.
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 opacity-50"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm">No products found</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Cart Panel ─────────────────────────────────────────── */}
      <div className="w-[360px] flex-shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
        {/* Cart header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-base font-bold text-gray-900"
                style={{
                  fontFamily: 'var(--font-display), Syne, sans-serif',
                }}
              >
                Cart : SI-{invoiceNum}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHoldList(!showHoldList)}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors relative"
              >
                Hold List
                {heldCarts.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {heldCarts.length}
                  </span>
                )}
              </button>
              <button
                onClick={clearCart}
                className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Hold list dropdown */}
        {showHoldList && (
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 max-h-48 overflow-y-auto">
            {heldCarts.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">
                No held carts
              </p>
            ) : (
              <div className="space-y-2">
                {heldCarts.map((held) => (
                  <div
                    key={held.id}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {held.id}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {held.items.length} item
                        {held.items.length !== 1 ? 's' : ''} &middot;{' '}
                        {new Date(held.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => restoreHeld(held.id)}
                        className="px-2 py-1 text-[10px] font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => removeHeld(held.id)}
                        className="px-2 py-1 text-[10px] font-medium text-red-500 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {checkoutDone && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Checkout complete!
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Order has been placed successfully.
              </p>
            </div>
          )}

          {!checkoutDone && cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              <p className="text-sm text-gray-400">
                No items added yet
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Click a product to add it
              </p>
            </div>
          )}

          {!checkoutDone &&
            cart.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onIncrease={() => increaseQty(item.product.id)}
                onDecrease={() => decreaseQty(item.product.id)}
                onRemove={() => removeItem(item.product.id)}
              />
            ))}
        </div>

        {/* Totals & actions */}
        <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span
                className="text-gray-700 font-medium"
                style={{
                  fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                }}
              >
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax (10%)</span>
              <span
                className="text-gray-700 font-medium"
                style={{
                  fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                }}
              >
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-gray-200">
              <span className="text-gray-900">Payable Amount</span>
              <span
                className="text-gray-900"
                style={{
                  fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
                }}
              >
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={holdCart}
              disabled={cart.length === 0}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Hold
            </button>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="flex-[2] py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
