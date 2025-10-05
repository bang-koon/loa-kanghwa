import PageLayout from "../components/PageLayout/PageLayout";
import styles from "../page.module.scss";

export default function PatchNotesPage() {
  return (
    <PageLayout title="패치내역">
      <>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 10월 5일</span> 상재 재료 버그 수정
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 10월 5일</span> 19-20 책 추가
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 9월 29일</span> UI 변경
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 9월 17일</span> 재련 정상화
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 9월 8일</span> 상재 정상화
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 9월 4일</span> 최신 레이드 데이터 추가
        </p>
      </>
    </PageLayout>
  );
}
