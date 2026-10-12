import { useState, useEffect } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 2499,
    oldPrice: 3499,
    emoji: '🎧',
    rating: 4.8,
    reviews: 124,
    badge: 'BESTSELLER',
    description: 'Premium sound, wireless freedom.',
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    category: 'Electronics',
    price: 3999,
    oldPrice: 5499,
    emoji: '⌚',
    rating: 4.7,
    reviews: 98,
    badge: 'POPULAR',
    description: 'Smart features for everyday life.',
  },
  {
    id: 3,
    name: 'Everyday Sneakers',
    category: 'Fashion',
    price: 1999,
    oldPrice: 2799,
    emoji: '👟',
    rating: 4.6,
    reviews: 86,
    badge: 'TRENDING',
    description: 'Comfort and style in every step.',
  },
  {
    id: 4,
    name: 'Classic Backpack',
    category: 'Accessories',
    price: 1499,
    oldPrice: 1999,
    emoji: '🎒',
    rating: 4.5,
    reviews: 72,
    badge: '',
    description: 'Your perfect everyday companion.',
  },
  {
    id: 5,
    name: 'Premium Sunglasses',
    category: 'Fashion',
    price: 1299,
    oldPrice: 1799,
    emoji: '🕶️',
    rating: 4.7,
    reviews: 64,
    badge: 'NEW',
    description: 'A timeless look with modern style.',
  },
  {
    id: 6,
    name: 'Minimal Desk Lamp',
    category: 'Home',
    price: 1799,
    oldPrice: 2299,
    emoji: '💡',
    rating: 4.6,
    reviews: 53,
    badge: '',
    description: 'Bring warmth to your workspace.',
  },
  {
    id: 7,
    name: 'Portable Speaker',
    category: 'Electronics',
    price: 2199,
    oldPrice: 2999,
    emoji: '🔊',
    rating: 4.8,
    reviews: 112,
    badge: 'POPULAR',
    description: 'Big sound in a compact design.',
  },
  {
    id: 8,
    name: 'Travel Coffee Mug',
    category: 'Home',
    price: 699,
    oldPrice: 999,
    emoji: '☕',
    rating: 4.5,
    reviews: 41,
    badge: '',
    description: 'Keep your favourite drink close.',
  },
]

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Accessories',
  'Home',
]

function App() {
  // Restore cart from LocalStorage when the app opens.
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shopsphere-cart')

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)

        if (Array.isArray(parsedCart)) {
          return parsedCart
        }
      }

      return []
    } catch (error) {
      console.error('Unable to load saved cart:', error)
      return []
    }
  })

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [showCart, setShowCart] = useState(false)
  const [notice, setNotice] = useState('')

  // Save cart whenever its contents change.
  useEffect(() => {
    try {
      localStorage.setItem('shopsphere-cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Unable to save cart:', error)
    }
  }, [cart])

  // Automatically hide notification messages.
  useEffect(() => {
    if (!notice) return

    const timer = setTimeout(() => {
      setNotice('')
    }, 2500)

    return () => clearTimeout(timer)
  }, [notice])

  // Add product to cart.
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id,
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })

    setNotice(`${product.name} added to cart!`)
  }

  // Increase product quantity.
  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }

  // Decrease quantity or remove product when quantity reaches zero.
  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  // Remove a product completely.
  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    )

    setNotice('Product removed from cart.')
  }

  // Clear all cart items.
  const clearCart = () => {
    setCart([])
    setNotice('Cart cleared.')
  }

  // Filter products using search and selected category.
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' || product.category === category

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating

      return a.id - b.id
    })

  // Calculate cart totals.
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const formatPrice = (price) =>
    `₹${price.toLocaleString('en-IN')}`

  return (
    <div className="app">
      {/* Navigation */}
      <header className="navbar">
        <a href="#home" className="logo">
          shop<span>sphere</span>
          <span className="logo-dot">.</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Shop</a>
          <a href="#benefits">Why Us</a>
        </nav>

        <div className="nav-actions">
          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
            aria-label="Open shopping cart"
          >
            🛒 <span>Cart</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Notification */}
      {notice && (
        <div className="toast-notification" role="status">
          ✓ {notice}
        </div>
      )}

      {/* Hero Section */}
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="hero-label">
              ✦ YOUR EVERYDAY MARKETPLACE
            </span>

            <h1>
              Find your
              <br />
              next <span>favourite</span>
              <br />
              thing.
            </h1>

            <p>
              Thoughtfully selected essentials, everyday favourites,
              and little things that make life better.
            </p>

            <div className="hero-buttons">
              <a href="#products" className="primary-button">
                Explore Collection <span>→</span>
              </a>

              <span className="hero-note">
                ✦ Quality finds. Happy prices.
              </span>
            </div>

            <div className="hero-stats">
              <div>
                <strong>500+</strong>
                <span>Happy customers</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Quality focused</span>
              </div>

              <div>
                <strong>Free</strong>
                <span>Shipping over ₹999</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-decoration hero-decoration-one" />
            <div className="hero-decoration hero-decoration-two" />

            <div className="hero-product-main">
              <span>🛍️</span>
              <p>GOOD THINGS INSIDE</p>
            </div>

            <div className="floating-card floating-card-top">
              <span>✦</span>
              <div>
                <strong>Curated for you</strong>
                <small>Little things, big joy</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span>🚚</span>
              <div>
                <strong>Quick delivery</strong>
                <small>Shopping made easy</small>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="benefits" id="benefits">
          <div className="benefit-item">
            <span>🚚</span>
            <div>
              <strong>Free Shipping</strong>
              <p>On orders above ₹999</p>
            </div>
          </div>

          <div className="benefit-item">
            <span>✨</span>
            <div>
              <strong>Quality Products</strong>
              <p>Selected with care</p>
            </div>
          </div>

          <div className="benefit-item">
            <span>🔒</span>
            <div>
              <strong>Secure Shopping</strong>
              <p>A smoother checkout experience</p>
            </div>
          </div>

          <div className="benefit-item">
            <span>💚</span>
            <div>
              <strong>Customer First</strong>
              <p>Your happiness matters</p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">THE GOOD STUFF</span>
              <h2>Our collection<span>.</span></h2>
              <p>Everyday essentials worth getting excited about.</p>
            </div>

            <div className="product-count">
              {filteredProducts.length} products
            </div>
          </div>

          {/* Search and sorting */}
          <div className="shop-controls">
            <div className="search-box">
              <span>⌕</span>

              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Categories */}
          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? 'category-button active'
                    : 'category-button'
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    {product.badge && (
                      <span className="product-badge">
                        {product.badge}
                      </span>
                    )}

                    <span className="product-emoji">
                      {product.emoji}
                    </span>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-rating">
                      <span>★</span>
                      <strong>{product.rating}</strong>
                      <small>({product.reviews} reviews)</small>
                    </div>

                    <div className="product-bottom">
                      <div className="product-price">
                        <strong>{formatPrice(product.price)}</strong>
                        <del>{formatPrice(product.oldPrice)}</del>
                      </div>

                      <button
                        className="add-to-cart"
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-search">
              <span>🔎</span>
              <h3>No products found</h3>
              <p>Try another search or choose a different category.</p>

              <button
                className="primary-button"
                onClick={() => {
                  setSearch('')
                  setCategory('All')
                }}
              >
                Show all products
              </button>
            </div>
          )}
        </section>

        {/* Promotional Banner */}
        <section className="promo-section">
          <div className="promo-content">
            <span>YOUR NEXT FAVOURITE IS WAITING</span>
            <h2>Good finds.<br />Better everyday.</h2>
            <p>
              Explore our collection and find something you'll love.
            </p>
            <a href="#products" className="promo-button">
              Shop the collection →
            </a>
          </div>

          <div className="promo-decoration">
            <span>✳</span>
            <span>✦</span>
            <span>✳</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <a href="#home" className="logo footer-logo">
              shop<span>sphere</span>
              <span className="logo-dot">.</span>
            </a>

            <p>
              Little things that make everyday life better.
              Find your next favourite with ShopSphere.
            </p>
          </div>

          <div className="footer-links">
            <strong>Explore</strong>
            <a href="#home">Home</a>
            <a href="#products">Shop</a>
            <a href="#benefits">Why Us</a>
          </div>

          <div className="footer-links">
            <strong>Shopping</strong>
            <a href="#products">All Products</a>
            <button onClick={() => setShowCart(true)}>
              Your Cart ({cartCount})
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <p>Made with care ✦</p>
        </div>
      </footer>

      {/* Shopping Cart Drawer */}
      {showCart && (
        <div
          className="cart-overlay"
          onClick={() => setShowCart(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
            aria-label="Shopping cart"
          >
            <div className="cart-header">
              <div>
                <span className="section-eyebrow">YOUR SELECTION</span>
                <h2>Your cart ({cartCount})</h2>
              </div>

              <button
                className="close-cart"
                onClick={() => setShowCart(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🛍️</span>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet.</p>

                <button
                  className="primary-button"
                  onClick={() => setShowCart(false)}
                >
                  Start shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-emoji">
                        {item.emoji}
                      </div>

                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <strong>{formatPrice(item.price)}</strong>

                        <div className="quantity-controls">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <strong>
                          {formatPrice(item.price * item.quantity)}
                        </strong>

                        <button
                          className="remove-item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total-row">
                    <span>Subtotal</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>

                  <p>
                    {cartTotal >= 999
                      ? '🎉 Your order qualifies for free shipping!'
                      : `Add ${formatPrice(999 - cartTotal)} more for free shipping.`}
                  </p>

                  <button
                    className="checkout-button"
                    onClick={() =>
                      setNotice('Checkout feature is coming soon!')
                    }
                  >
                    Continue to checkout →
                  </button>

                  <button
                    className="clear-cart-button"
                    onClick={clearCart}
                  >
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default App