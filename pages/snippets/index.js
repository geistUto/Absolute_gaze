import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Snippets.module.css';
import Link from 'next/link';

export default function Snippets() {
  const [currentSnippet, setCurrentSnippet] = useState('');
  const [snippets, setSnippets] = useState([]);
  const [snippetId, setSnippetId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch recent snippets on load
  useEffect(() => {
    fetchRecentSnippets();
  }, []);

  const fetchRecentSnippets = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/mind-snippets/recent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSnippets(response.data.data);
    } catch (error) {
      console.error('Error fetching snippets:', error);
    }
  };

  const handleSnippetBlur = async () => {
    if (currentSnippet.trim()) {
      setIsSaving(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/mind-snippets/add-update`,
          { content: currentSnippet, id: snippetId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setSnippetId(response.data.uuid); // Save the ID to prevent duplicate creation
        setCurrentSnippet(''); // Clear after saving
        setTimeout(() => {
          fetchRecentSnippets();
      }, 10000);
      } catch (error) {
        console.error('Error saving snippet:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className={styles.snippetContainer}>
      <div className={styles.header}>
        <h1>Mind Snippets</h1>
      </div>
      <textarea
        className={styles.textarea}
        value={currentSnippet}
        onChange={(e) => setCurrentSnippet(e.target.value)}
        onBlur={handleSnippetBlur}
        placeholder="Start typing your snippet..."
        rows="5"
      />
      {isSaving && <div className={styles.saving}>Saving...</div>}
      <div className={styles.snippetList}>
  {snippets.map((snippet) => (
    <div key={snippet.uuid} className={styles.snippetItem}>
      <h3>{snippet.title}</h3>
      <p>{snippet.content}</p>

      {/* Sleek connected Parent Realm and Realm */}
      <div className={styles.realmInfo}>
        <strong>Realm: </strong> 
        <div className={styles.realmConnection}>
          {snippet?.realm?.parentRealm && (
            <>
              {/* Link for Parent Realm */}
              <Link href={`/realms/${snippet?.realm?.parentRealm?.uuid}`}>
                <a className={styles.realmLink}>
                  {snippet?.realm?.parentRealm?.name}
                </a>
              </Link>
              <span className={styles.arrow}>→</span>
            </>
          )}
          {/* Link for Current Realm */}
          <Link href={`/realms/${snippet.realm?.uuid}`}>
            <a className={styles.realmLink}>
              {snippet.realm?.name}
            </a>
          </Link>
        </div>
      </div>

      {/* Associated Tags */}
      <div className={styles.tags}>
        <strong>Tags:</strong> 
        {snippet.realmsIntegrated && snippet.realmsIntegrated.length > 0 ? (
          snippet.realmsIntegrated.map((realm) => (
            <Link key={realm.uuid} href={`/realms/${realm?.uuid}`}>
              <a className={styles.tag}>{realm?.name}</a>
            </Link>
          ))
        ) : (
          <span>No tags available</span>
        )}
      </div>
    </div>
  ))}
</div>
</div>  
  );
}
