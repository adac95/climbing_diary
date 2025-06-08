"use client";

import { useParams } from "next/navigation";
import styles from "./skeletonTopoSelector.module.css";

export default function SkeletonTopoSelector() {
  const { regionId } = useParams();
  const showTwoInputs = Boolean(regionId);

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Escoge el lugar</h3>
      <section className={styles.options}>
        {/* Selector de Región - Siempre visible */}
        <div className={styles.selectorContainer}>
          <div className={styles.selectWrapper}>
            <div className={styles.selectContent}>
              <div className={styles.selectSkeleton}>
                <div className={styles.selectInner}>
                  <div className={styles.selectText}></div>
                  <div className={styles.selectIcon}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de Lugar - Condicional */}
        {showTwoInputs && (
          <div className={styles.selectorContainer}>
            <div className={styles.selectWrapper}>
              <div className={styles.selectContent}>
                <div className={styles.selectSkeleton}>
                  <div className={styles.selectInner}>
                    <div className={styles.selectText}></div>
                    <div className={styles.selectIcon}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
