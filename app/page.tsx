"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("방울토마토라면");

  useEffect(() => {
    function fetchData() {
      fetch(`/api/getCharacterLevel?characterName=${name}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("데이터를 가져오는 데 실패했습니다.");
          }
          return response.json();
        })
        .then(result => setData(result))
        .catch(error => setError((error as Error).message));
    }

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
