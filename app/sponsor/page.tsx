import PageLayout from "../components/PageLayout/PageLayout";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function SponsorPage() {
  return (
    <PageLayout title="후원하기">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p>ㅤ카카오 페이 송금 qr입니다. 조금의 마음도 감사히 받겠습니다.</p>
        <p> 비루한 자취생, 취준생 에게 자비를 주소서(리스)</p>
        <Image
          style={{ alignSelf: "center", marginTop: "15%" }}
          src="/qr/sponsor_qr.JPG"
          alt="카카오페이 후원 QR코드"
          width={256}
          height={256}
        />
        <p style={{ alignSelf: "center", marginTop: "1%" }}> 방 * 민</p>
      </div>
    </PageLayout>
  );
}
