import PageLayout from "../components/PageLayout/PageLayout";
import styles from "../page.module.scss";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "패치노트 - 로아쿤",
  description: "로아쿤 패치노트",
};

export default function PatchNotesPage() {
  return (
    <PageLayout title="패치내역">
      <>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 12월 13일</span> 레이드 보상 업데이트
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 12월 10일</span> 모바일 UI 개선, 시세 갱신 주기 단축
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 12월 10일</span> 성장 지원, 모코코 챌린지 적용 로직 추가, 상급 재련 효율
          페이지 추가
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 10월 30일</span> 일반재련 성능 개선, 3티어 하위 티어 선택 시 에러 사항
          수정
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 10월 20일</span> 모바일 UI 수정
        </p>
        <p>
          <span className={styles.patchDate}>ㅤ • 2025년 10월 12일</span> 레이드 선택 UI 수정
        </p>
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
