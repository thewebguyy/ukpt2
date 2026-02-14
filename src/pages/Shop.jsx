import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import ProductCard from '../components/product/ProductCard';
import { Helmet } from 'react-helmet-async';

const PRODUCTS_PER_PAGE = 12;

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

    // Filter States
    const categoryFilter = searchParams.get('category') || 'all';
    const searchTerm = searchParams.get('search') || '';
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('featured');

    const { data: allProducts, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => ProductService.getProducts({ limit: 100 })
    });

    const filteredProducts = useMemo(() => {
        if (!allProducts) return [];

        let filtered = [...allProducts];

        // Category Filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.categories?.includes(categoryFilter) || p.category === categoryFilter);
        }

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.category?.toLowerCase().includes(term)
            );
        }

        // Price Filter
        if (priceRange.min) filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
        if (priceRange.max) filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));

        // Sort
        if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name-az') filtered.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === 'name-za') filtered.sort((a, b) => b.name.localeCompare(a.name));

        return filtered;
    }, [allProducts, categoryFilter, searchTerm, priceRange, sortBy]);

    const handleCategoryChange = (cat) => {
        if (cat === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    const clearFilters = () => {
        setSearchParams({});
        setPriceRange({ min: '', max: '' });
        setSortBy('featured');
        setVisibleCount(PRODUCTS_PER_PAGE);
    };

    const visibleProducts = filteredProducts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProducts.length;

    return (
        <div className="shop-page">
            <Helmet>
                <title>Shop All Products - CustomiseMe UK</title>
            </Helmet>

            <section className="section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold">{searchTerm ? `RESULTS FOR "${searchTerm.toUpperCase()}"` : 'SHOP ALL PRODUCTS'}</h1>
                        <p className="text-grey-dark">Discover our complete collection of custom designs and party essentials</p>
                    </div>

                    <button
                        className="btn btn-outline-dark w-100 d-lg-none mb-4"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        {showMobileFilters ? 'HIDE FILTERS' : 'SHOW FILTERS & SORT'}
                    </button>

                    <div className="row">
                        {/* Sidebar Filters */}
                        <div className={`col-lg-3 ${showMobileFilters ? 'd-block' : 'd-none d-lg-block'}`}>
                            <div className="filter-sidebar p-4 bg-light">
                                <h3 className="h5 mb-4 border-bottom pb-2">FILTERS</h3>

                                <div className="filter-section mb-4">
                                    <div className="filter-title fw-bold mb-2 small text-uppercase">Category</div>
                                    {['all', 'apparel', 'stickers', 'party-decor', 'accessories'].map(cat => (
                                        <div key={cat} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="category"
                                                id={`cat-${cat}`}
                                                checked={categoryFilter === cat}
                                                onChange={() => handleCategoryChange(cat)}
                                            />
                                            <label className="form-check-label small text-capitalize" htmlFor={`cat-${cat}`}>
                                                {cat === 'all' ? 'All Products' : cat.replace('-', ' ')}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="filter-section mb-4">
                                    <div className="filter-title fw-bold mb-2 small text-uppercase">Price Range</div>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button className="btn btn-link btn-sm p-0 text-dark text-decoration-underline" onClick={clearFilters}>
                                    Clear All Filters
                                </button>
                            </div>
                        </div>

                        {/* Product Grid Area */}
                        <div className="col-lg-9">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="small text-muted">
                                    {isLoading ? 'Loading products...' : `Showing ${filteredProducts.length} products`}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <label className="small text-nowrap mb-0">Sort by:</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name-az">Name: A to Z</option>
                                        <option value="name-za">Name: Z to A</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row g-4">
                                {isLoading ? (
                                    [...Array(6)].map((_, i) => (
                                        <div key={i} className="col-6 col-md-4">
                                            <div className="placeholder-glow">
                                                <div className="placeholder w-100" style={{ height: '250px' }}></div>
                                                <div className="placeholder col-8 mt-2"></div>
                                                <div className="placeholder col-4 mt-1"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : visibleProducts.length > 0 ? (
                                    <>
                                        {visibleProducts.map(product => (
                                            <div key={product.id} className="col-6 col-md-4">
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                        {hasMore && (
                                            <div className="col-12 text-center mt-4">
                                                <button
                                                    className="btn btn-outline-dark px-5"
                                                    onClick={() => setVisibleCount(prev => prev + PRODUCTS_PER_PAGE)}
                                                >
                                                    LOAD MORE ({filteredProducts.length - visibleCount} remaining)
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="col-12 text-center py-5">
                                        <p className="lead text-muted">No products found matching your filters.</p>
                                        <button className="btn btn-outline-dark" onClick={clearFilters}>Clear Filters</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Shop;
