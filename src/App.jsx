import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import './App.css';

export default function App({ shlokaId }) {
  const [shloka, setShloka] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine ID from URL query string (?id=X) or passed prop, default to "1"
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = String(shlokaId || urlParams.get('id') || '1').trim();

    Papa.parse('/shloks.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const entries = results.data.map((item) => ({
          id: item['S.No.'],
          chapter: item.Chapter,
          verse: item.Verse,
          reference: item.Reference,
          sanskrit: item['Sanskrit Shloka'],
          hindi: item['Hindi Explanation'],
          english: item['English Explanation']
        }));

        const found = entries.find((item) =>
          String(item.id).trim() === targetId ||
          `${item.chapter}.${item.verse}` === targetId ||
          String(item.reference).trim().endsWith(targetId)
        ) || entries[0];

        setShloka(found);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setLoading(false);
      }
    });
  }, [shlokaId]);

  if (loading) {
    return <div className="loading-text">✦ Unrolling Sacred Scroll... ✦</div>;
  }

  return (
    <div className="scroll-wrapper">
      <div className="scroll-assembly">
        {/* Left Roller */}
        <div className="wooden-roller left-roller">
          <div className="knob top-knob"></div>
          <div className="roller-bar"></div>
          <div className="knob bottom-knob"></div>
        </div>

        {/* Unrolling Parchment */}
        <motion.div
          className="parchment-unroller"
          initial={{ width: 0 }}
          animate={{ width: "700px" }}
          transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="parchment-body">
            <div className="border-pattern-top"></div>

            <div className="parchment-inner">
              {shloka && (
                <div className="scroll-content">
                  <div className="sanskrit-symbol">ॐ</div>
                  <div className="reference-tag">{shloka.reference}</div>

                  {/* Sanskrit Shloka */}
                  <div className="sanskrit-text">
                    {shloka.sanskrit ? shloka.sanskrit.replace(/\|/g, '|\n') : ''}
                  </div>

                  <div className="divider">✦ ✤ ✦</div>

                  {/* Hindi Translation */}
                  <div className="translation-hindi">
                    {shloka.hindi}
                  </div>

                  {/* English Translation */}
                  <div className="translation-english">
                    {shloka.english}
                  </div>
                </div>
              )}
            </div>

            <div className="border-pattern-bottom"></div>
          </div>

          {/* Right Roller Attached directly to moving right edge */}
          <div className="wooden-roller right-roller">
            <div className="knob top-knob"></div>
            <div className="roller-bar"></div>
            <div className="knob bottom-knob"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}