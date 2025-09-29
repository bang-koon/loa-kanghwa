import Link from "next/link";
import styles from "./Footer.module.scss";

interface FooterProps {
  currentYear: number;
}

const Footer = ({ currentYear }: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link href="/terms" className={styles.link}>
          이용약관
        </Link>
        <Link href="/privacy" className={styles.link}>
          개인정보처리방침
        </Link>
        <Link href="/patch-notes" className={styles.link}>
          패치내역
        </Link>
        <Link href="/contact" className={styles.link}>
          문의하기
        </Link>
        <Link href="/sponsor" className={styles.link}>
          후원하기
        </Link>
      </nav>
      <p className={styles.copyright}>Copyright © {currentYear} loa-koon All rights reserved.</p>
    </footer>
  );
};

export default Footer;
