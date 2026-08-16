'use client';

import React, { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';

const LIMITS = {
  image: { bytes: 10 * 1024 * 1024, label: '10MB', accept: 'image/*' },
  video: { bytes: 100 * 1024 * 1024, label: '100MB', accept: 'video/*' },
};

interface Props {
  label: string;
  hint: string;
  kind: 'image' | 'video';
  value: string;
  onChange: (url: string) => void;
}

export function UploadField({ label, hint, kind, value, onChange }: Props) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const limit = LIMITS[kind];

  async function handleFile(file: File) {
    setError('');

    if (file.size > limit.bytes) {
      setError(`That file is too big. Try one under ${limit.label}.`);
      return;
    }

    setProgress(0);
    try {
      const result = await upload(`portfolio/media/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      onChange(result.url);
      setProgress(null);
    } catch {
      setProgress(null);
      setError('That upload did not go through. Check your connection and try again.');
    }
  }

  return (
    <div className="ad-field">
      <label className="ad-label">{label}</label>
      <p className="ad-hint">{hint}</p>

      {value ? (
        <div className="ad-preview">
          {kind === 'image'
            ? <img src={value} alt="" className="ad-thumb" />
            : <video src={value} className="ad-thumb" muted />}
          <button type="button" className="ad-remove" onClick={() => onChange('')}>
            Remove
          </button>
        </div>
      ) : (
        <div
          className={`ad-drop${dragging ? ' is-dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
        >
          {progress === null ? (
            <>
              <strong>Drop a file here</strong>
              <span>or click to choose one — up to {limit.label}</span>
            </>
          ) : (
            <>
              <span>Uploading… {Math.round(progress)}%</span>
              <div className="ad-bar"><div style={{ width: `${progress}%` }} /></div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={limit.accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {error && <p className="ad-error">{error}</p>}
    </div>
  );
}
