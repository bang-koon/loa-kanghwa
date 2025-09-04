"use client";
import { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import Image from "next/image";
import { useView } from "../../lib/ViewContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { activeView, setActiveView } = useView();

  useEffect(() => {
    const handleScroll = () =>
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`${styles.headerContainer} ${
        isScrolled ? styles.scrolled : ""
      }`}
    >
      <div className={styles.headerBox}>
        <div className={styles.title}>
          <Image src="/logo.png" width={22} height={22} alt="logo" />
          <h1>로아쿤</h1>
        </div>
        <div className={styles.navigation}>
          <h2
            className={activeView === "reward" ? styles.active : ""}
            onClick={() => setActiveView("reward")}
          >
            레이드 보상
          </h2>
          <h2
            className={activeView === "calculator" ? styles.active : ""}
            onClick={() => setActiveView("calculator")}
          >
            재련 계산기
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Header;
