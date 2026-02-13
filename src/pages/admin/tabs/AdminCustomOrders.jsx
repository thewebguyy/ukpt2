const AdminCustomOrders = () => {
    return (
        <div>
            <h2 className="h4 fw-bold mb-4">CUSTOM ORDER REQUESTS</h2>
            <div className="alert alert-info">
                <p className="mb-0">
                    Custom order management coming soon. This will track orders with uploaded artwork
                    and special requests that require manual review.
                </p>
            </div>
            <div className="card border-0 shadow-sm p-4 mt-4">
                <h3 className="h5 fw-bold mb-3">Features in Development:</h3>
                <ul className="mb-0">
                    <li>Track orders with custom artwork uploads</li>
                    <li>Approve/reject custom designs before production</li>
                    <li>Communicate with customers about design revisions</li>
                    <li>Flag orders requiring special attention</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminCustomOrders;
