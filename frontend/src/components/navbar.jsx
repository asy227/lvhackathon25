import './navbar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">LOGO</h2>
      <ul className="sidebar-menu">
        <li><a href="#">🏠</a></li>
        <li><a href="#">📅</a></li>
        <li><a href="#">👥</a></li>
        <li><a href="#">📝</a></li>
      </ul>
    </div>
  );
}