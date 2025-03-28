"use client";

import { useParams } from "next/navigation";
import styles from "./skeletonTopoSelector.module.css";

export default function SkeletonTopoSelector() {
  const params = useParams();
  const { regionId } = params;
  const showTwoInputs = regionId != undefined || null || ''

  return (
    <div className={styles.container}>
      <div className={styles.labelSkeleton}></div>

      <div className={styles.inputSkeleton}>
        <div className={styles.textSkeleton}></div>
        <div className={styles.iconSkeleton}></div>
      </div>

      {showTwoInputs && (
        <>
          <div className={styles.inputSkeleton}>
            <div className={styles.textSkeleton}></div>
            <div className={styles.iconSkeleton}></div>
          </div>
        </>
      )}
    </div>
  );
}
