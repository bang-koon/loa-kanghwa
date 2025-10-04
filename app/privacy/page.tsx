import PageLayout from "../components/PageLayout/PageLayout";

export default function PrivacyPage() {
  return (
    <PageLayout title="개인정보 처리방침">
      <p>ㅤ본 웹사이트는 개인정보를 직접 수집하지 않습니다.</p>
      <p>
        Google AdSense 및 Google Analytics와 같은 서드파티 서비스가 추가된다면 사용자 경험 개선 및 광고 게재를 위해 데이터를
        수집할 수 있습니다. 이에 대한 자세한 내용은 각 서비스의 개인정보 처리방침을 참조해 주십시오.
      </p>
    </PageLayout>
  );
}
