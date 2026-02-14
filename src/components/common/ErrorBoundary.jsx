import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
                    <div className="text-center p-5">
                        <h1 className="display-4 fw-bold mb-3">Something went wrong</h1>
                        <p className="text-muted mb-4">An unexpected error occurred. Please try refreshing the page.</p>
                        <button
                            className="btn btn-dark btn-lg px-5"
                            onClick={() => {
                                this.setState({ hasError: false });
                                window.location.href = '/';
                            }}
                        >
                            GO TO HOMEPAGE
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
