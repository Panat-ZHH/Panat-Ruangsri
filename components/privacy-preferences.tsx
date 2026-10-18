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
      <dialog ref={dialogRef} className="privacy-dialog" aria-labelledby="privacy-title" data-lenis-prevent>
        <form method="dialog" onSubmit={() => save(draft)}>
          <h2 id="privacy-title">Datenschutz-Einstellungen</h2>
          <p>Diese Website verwendet keine Analyse- oder Werbe-Tracker. Externe Inhalte bleiben ohne deine Zustimmung blockiert.</p>
          <label className="privacy-option">
            <input type="checkbox" checked={draft} onChange={(event) => setDraft(event.target.checked)} />
            <span><strong>Externe Website-Inhalte</strong>Die Live-Vorschau von wendico.ch darf geladen werden. Dabei wird unter anderem deine IP-Adresse an den externen Anbieter übermittelt.</span>
          </label>
          <p>Die Auswahl wird lokal in diesem Browser gespeichert. Ein Widerruf beendet die Einbettung, löscht aber keine vom externen Anbieter bereits gespeicherten Daten.</p>
          <div className="privacy-actions">
            <button type="button" onClick={() => { setDraft(false); save(false); dialogRef.current?.close(); }}>Externe Inhalte ablehnen</button>
            <button type="submit">Auswahl speichern</button>
          </div>
        </form>
      </dialog>
    </PrivacyContext.Provider>
  );
}

export function PrivacySettingsButton() {
  const { openSettings } = usePrivacy();
  return <button type="button" onClick={openSettings}>Cookie-Einstellungen</button>;
}