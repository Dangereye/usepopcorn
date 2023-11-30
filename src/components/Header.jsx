import Logo from './Logo';

export default function Navbar({ children }) {
  return (
    <header className='nav-bar'>
      <Logo />
      {children}
    </header>
  );
}
