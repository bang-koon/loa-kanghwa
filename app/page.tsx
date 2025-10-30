import styles from "./page.module.scss";
import Link from "next/link";

export default async function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroTextWrapper}>
          <h1 className={styles.mainTitle}>loa-koon</h1>
          <p className={styles.subTitle}>로스트아크 재련, 상재 계산기 & 레이드 보상 정보</p>
        </div>
        <section className={styles.selectionButtonsSection}>
          <div className={styles.selectionButtons}>
            <Link href="/refine" className={styles.button}>
              <span className={styles.buttonTitle}>재련 계산기</span>
              <span className={styles.buttonDescription}>
                현재 시세를 기준으로 목표 레벨까지의 최적 재료와 골드를 계산합니다.
              </span>
            </Link>
            <Link href="/raid" className={styles.button}>
              <span className={styles.buttonTitle}>레이드 보상</span>
              <span className={styles.buttonDescription}>레이드 보상 목록을 확인합니다.</span>
            </Link>
          </div>
        </section>
      </section>

      <section className={styles.infoSection}>
        <h2>ㅤ공지</h2>
        <p>ㅤ • 재련값은 평균값 기준이며 숨결, 책등의 모든 조합을 테스트하여 가장 저렴한 방법으로 보여드립니다.</p>
        <p>ㅤ • 재료의 가격은 약 한 시간마다 갱신됩니다.</p>
        <p>ㅤ • 여러 구간별 재련 비용에 특화됐기에 단계별 세세한 강화 방법을 보고 싶다면 icepeng 을 추천합니다!</p>
        {/* <Link href="/notices" className={styles.moreLink}>
          더 많은 공지 보기
        </Link> */}
      </section>

      <section className={styles.infoSection}>
        <h2>ㅤ최근 패치내역</h2>
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
        <Link href="/patch-notes" className={styles.moreLink}>
          더 많은 패치내역 보기
        </Link>
      </section>
    </main>
  );
}
