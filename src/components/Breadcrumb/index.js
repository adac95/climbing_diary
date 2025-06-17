
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li key={item.href || `breadcrumb-${index}`} className={styles.breadcrumbItem}>
            {/* Mostrar separador entre items (no al inicio) */}
            {index > 0 && <span className={styles.separator}>›</span>}
            
            {/* Ítem con icono de casa si es el inicio */}
            {item.label === "Inicio" && index === 0 ? (
              item.href ? (
                <a href={item.href} className={styles.link}>
                  <svg 
                    className={styles.homeIcon} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    width="16" 
                    height="16"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                </a>
              ) : (
                <span className={styles.current} aria-current="page">
                  <svg 
                    className={styles.homeIcon} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    width="16" 
                    height="16"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                </span>
              )
            ) : (
              /* Items normales */
              item.href && index < items.length - 1 ? (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ) : (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              )
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
