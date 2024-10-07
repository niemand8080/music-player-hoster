"use client";
import React, { useEffect, useState } from "react";

interface BoldCharsProps {
  filter: string;
  query: string;
}

const BoldChars: React.FC<BoldCharsProps> = ({ filter, query }) => {
  const [indexIsBold, setIndexIsBold] = useState<number[]>([]);
  const splatFilter = filter.toUpperCase().split("");
  const splatQueryUpper = query.toUpperCase().split("");
  const splatQuery = query.split("");

  useEffect(() => {
    let queryIndex = 0;
    const indexArr: number[] = [];

    for (const filterChar of splatFilter) {
      // Find the index of filterChar in splatQueryUpper, starting from queryIndex
      const index = splatQueryUpper.indexOf(filterChar, queryIndex);

      if (index !== -1) {
        indexArr.push(index);
        queryIndex = index + 1;
      }
    }

    setIndexIsBold(indexArr);
  }, [filter, query]);

  return (
    <span>
      {splatQuery
        ? splatQuery.map((char, index) => (
            <span
              key={index}
              className={`${indexIsBold.includes(index) ? "font-bold" : ""} transition-all duration-300`}
            >
              {char}
            </span>
          ))
        : null}
    </span>
  );
};

export default BoldChars;
