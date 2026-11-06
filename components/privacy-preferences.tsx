'use client';

import { createContext, useContext, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

const STORAGE_KEY = 'panat-external-content-v1';
const CHANGE_EVENT = 'panat:privacy-change';
let sessionAllowed = false;
const subscribe = (notify: () => void) => {
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener('storage', notify);
  };
};
const snapshot = () => {
  try { return localStorage.getItem(STORAGE_KEY) === 'allowed'; } catch { return sessionAllowed; }
};
const PrivacyContext = createContext({ external: false, allowExternal: () => {}, openSettings: () => {} });

export function usePrivacy() {
  return useContext(PrivacyContext);
}

export default function PrivacyPreferences({ children }: { children: ReactNode }) {
  const external = useSyncExternalStore(subscribe, snapshot, () => false);
  const [draft, setDraft] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const save = (allowed: boolean) => {
    sessionAllowed = allowed;
    try { localStorage.setItem(STORAGE_KEY, allowed ? 'allowed' : 'blocked'); } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const openSettings = () => {
    setDraft(external);
    dialogRef.current?.showModal();
  };

  return (
    <PrivacyContext.Provider value={{ external, allowExternal: () => save(true), openSettings }}>
      {children}
      <dialog ref={dialogRef} className="privacy-dialog" aria-labelledby="privacy-title" data-lenis-prevent lang="en">
        <form method="dialog" onSubmit={() => save(draft)}>
          <h2 id="privacy-title">Privacy settings</h2>
          <p>This site does not use analytics or advertising trackers. External content stays blocked until you consent.</p>
          <label className="privacy-option">
            <input type="checkbox" checked={draft} onChange={(event) => setDraft(event.target.checked)} />
            <span><strong>External website content</strong>The live preview of wendico.ch may be loaded. This sends your IP address and other connection data to the external provider.</span>
          </label>
          <p>Your choice is stored locally in this browser. Revoking consent stops the embed but does not delete data already stored by the external provider.</p>
          <div className="privacy-actions">
            <button type="button" onClick={() => { setDraft(false); save(false); dialogRef.current?.close(); }}>Reject external content</button>
            <button type="submit">Save choices</button>
          </div>
        </form>
      </dialog>
    </PrivacyContext.Provider>
  );
}

export function PrivacySettingsButton() {
  const { openSettings } = usePrivacy();
  return <button type="button" onClick={openSettings}>Cookie settings</button>;
}