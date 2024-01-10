import React from "react";
import { useParams } from "react-router-dom";

export default function Story() {
  const { wordsToLearn } = useParams();
  return <div>{wordsToLearn}</div>;
}
