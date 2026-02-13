import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Account = () => {
    const { user, loading } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!loading && user) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isLogin) {
                const result = await AuthService.login(formData.email, formData.password);
                if (result.success) {
                    toast.success('Successfully logged in!');
                } else {
                    toast.error(result.message);
                }
            } else {
                const result = await AuthService.register(formData.name, formData.email, formData.password);
                if (result.success) {
                    toast.success('Registration successful! Please check your email to verify.');
                    setIsLogin(true);
                } else {
                    toast.error(result.message);
                }
            }
        } catch (err) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const result = await AuthService.googleSignIn();
        if (result.success) {
            toast.success('Signed in with Google!');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="account-page py-5 bg-light min-vh-100">
            <Helmet>
                <title>{isLogin ? 'Login' : 'Sign Up'} - CustomiseMe UK</title>
            </Helmet>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
                            <div className="text-center mb-4">
                                <img src="/icon.png" alt="CMUK" className="mb-3" style={{ height: '50px' }} />
                                <h2 className="fw-bold">{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
                                <p className="text-muted">{isLogin ? 'Login to manage your orders and profile.' : 'Sign up to start designing and ordering.'}</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">FULL NAME</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg bg-light border-0"
                                            placeholder="Enter your name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">EMAIL ADDRESS</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="Enter your email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between">
                                        <label className="form-label small fw-bold">PASSWORD</label>
                                        {isLogin && <button type="button" className="btn btn-link p-0 small text-decoration-none">Forgot Password?</button>}
                                    </div>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-dark btn-lg w-100 py-3 fw-bold rounded-pill shadow-sm"
                                >
                                    {isSubmitting ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                                    {isLogin ? 'LOGIN' : 'SIGN UP'}
                                </button>
                            </form>

                            <div className="divider d-flex align-items-center my-4">
                                <hr className="flex-grow-1" />
                                <span className="px-3 small text-muted">OR</span>
                                <hr className="flex-grow-1" />
                            </div>

                            <button
                                onClick={handleGoogleSignIn}
                                className="btn btn-outline-dark btn-lg w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-pill border-2"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/0/google.svg" width="20" alt="Google" />
                                <span className="small fw-bold">CONTINUE WITH GOOGLE</span>
                            </button>

                            <div className="text-center mt-4">
                                <p className="small text-muted mb-0">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="btn btn-link p-0 ms-1 small fw-bold text-dark text-decoration-none border-bottom border-dark border-2"
                                    >
                                        {isLogin ? 'CREATE ONE' : 'LOGIN HERE'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
