"use client";
import { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => (window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false));

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = `${styles.headerContainer} ${isHomePage && !isScrolled ? styles.homeInitialState : styles.otherPageState} ${
    isScrolled ? styles.scrolled : ""
  }`;

  return (
    <div className={headerClass}>
      <div className={styles.headerBox}>
        <Link href="/" className={styles.title}>
          <Image src="/logo.png" width={30} height={30} alt="logo" />
          {!(isHomePage && !isScrolled) && <h1>로아쿤</h1>}
        </Link>
        {!(isHomePage && !isScrolled) && (
          <div className={styles.navigation}>
            <Link href="/refine" className={`${styles.navLink} ${pathname === "/refine" ? styles.active : ""}`}>
              재련 계산기
            </Link>
            <Link href="/raid" className={`${styles.navLink} ${pathname === "/raid" ? styles.active : ""}`}>
              레이드 보상
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
