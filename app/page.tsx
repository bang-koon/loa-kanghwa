"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [characterInfo, setCharacterInfo] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("방울토마토라면");

  useEffect(() => {
    function fetchCharacterInfo() {
      fetch(`/api/getCharacterInfo?characterName=${name}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("데이터를 가져오는 데 실패했습니다.");
          }
          return response.json();
        })
        .then(result => setCharacterInfo(result))
        .catch(error => setError((error as Error).message));
    }
    fetchCharacterInfo();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!characterInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(characterInfo, null, 2)}</pre>
    </div>
  );
}
