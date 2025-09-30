import React from 'react';
import styles from './PageLayout.module.scss';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children, maxWidth = '800px' }) => {
  return (
    <main className={styles.postContainer} style={{
      maxWidth: maxWidth, // prop으로 받은 maxWidth 적용
    }}>
      <h1>{title}</h1>
      {children}
    </main>
  );
};

export default PageLayout;
