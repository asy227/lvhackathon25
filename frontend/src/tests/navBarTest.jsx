import Navbar from '../components/navbar';

export default function NavBarTest() {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ marginLeft: '220px', padding: '20px', width: '100%' }}>
        <h1>Testing Sidebar Component</h1>
        <p>If you see the sidebar here, it's working fine ✅</p>
      </div>
    </div>
  );
}
