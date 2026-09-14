import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import './App.css';

export default function App({ shlokaId }) {
  const [shloka, setShloka] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Select the entry by its S.No. value from ?id=X.
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = String(urlParams.get('id') || shlokaId || '1').trim();

    Papa.parse('/shloks.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const found = results.data.find((item) =>
          String(item['S.No.']).trim() === targetId
        );

        if (!found) {
          setError(`No shloka found for serial number ${targetId}.`);
          setLoading(false);
          return;
        }

        setShloka({
          id: found['S.No.'],
          reference: found.Reference,
          sanskrit: found['Sanskrit Shloka'],
          hindi: found['Hindi Explanation'],
          english: found['English Explanation']
        });
        setLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setError('Unable to load the shloka data.');
        setLoading(false);
      }
    });
  }, [shlokaId]);

  if (loading) {
    return <div className="loading-text">✦ Unrolling Sacred Scroll... ✦</div>;
  }

  if (error) {
    return <div className="loading-text">{error}</div>;
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