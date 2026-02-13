import { Link } from 'react-router-dom';

const MegaMenu = ({ title, link, children }) => {
    return (
        <li className="nav-item mega-menu">
            <Link className="nav-link" to={link}>{title}</Link>
            <div className="mega-dropdown">
                <div className="container">
                    {children}
                </div>
            </div>
        </li>
    );
};

export default MegaMenu;
