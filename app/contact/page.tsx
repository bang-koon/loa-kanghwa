import PageLayout from "../components/PageLayout/PageLayout";
import Image from "next/image";

export default function ContactPage() {
  return (
    <PageLayout title="문의하기">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p>ㅤ무엇이든 물어보세요.</p>
        <Image
          style={{ alignSelf: "center", marginTop: "15%" }}
          src="/qr/contact_qr.jpeg"
          alt="오픈카톡 문의 QR코드"
          width={256}
          height={256}
        />
        <p style={{ alignSelf: "center" }}> 카카오톡 오픈 채팅방 QR</p>
      </div>
    </PageLayout>
  );
}
