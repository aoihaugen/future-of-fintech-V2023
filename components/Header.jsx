import Link from "next/link";
import styles from "./Header.module.css";
export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">Hjem</Link>
      <h1>⚡ Hvilken leverandør burde jeg hatt forrige måned?⚡</h1>
    </header>
  );
}
