import PageLayout from "../components/PageLayout/PageLayout";
import styles from "../page.module.scss";

export default function PatchNotesPage() {
  return (
    <PageLayout title="패치내역">
      <>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 9월 29일</span> UI 변경
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 9월 20일</span> 재련 계산기 최적화 알고리즘 개선
        </p>
      </>
    </PageLayout>
  );
}
