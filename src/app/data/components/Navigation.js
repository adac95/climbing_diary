import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li><Link href="/data/country">País</Link></li>
        <li><Link href="/data/region">Región</Link></li>
        <li><Link href="/data/place">Lugar</Link></li>
        <li><Link href="/data/sector">Sector</Link></li>
        <li><Link href="/data/camping">Camping</Link></li>
        <li><Link href="/data/approach">Approach</Link></li>
        <li><Link href="/data/lodge">Lodge</Link></li>
        <li><Link href="/data/style">Estilo</Link></li>
        <li><Link href="/data/route">Ruta</Link></li>
        <li><Link href="/data/developer">Developer</Link></li>
        <li><Link href="/data/route_developer">Rel. Route-Developer</Link></li>
        <li><Link href="/data/sector_style">Rel. Sector-Style</Link></li>
      </ul>
    </nav>
  );
}
