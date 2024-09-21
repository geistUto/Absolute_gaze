import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../../styles/Snippets.module.css'; 

export default function RealmSnippets() {
  const router = useRouter();
  const { realmId } = router.query;
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch snippets for the given realm ID from your API
    const fetchSnippets = async () => {
      if (realmId) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/mind-snippets/by-realm/${realmId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          setSnippets(response.data.data);
        } catch (error) {
          console.error('Error fetching snippets:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSnippets();
  }, [realmId]);

  if (loading) {
    return <p className={styles.loading}>Loading snippets...</p>;
  }

  return (
    
      <>
      <h4 className={styles.header}> {snippets.length > 0 ? snippets[0].realm.name + " Snippets" : " No Snippets here"}</h4>
    <div className={styles.snippetList}>
        {snippets.map((snippet) => (
          <div key={snippet.uuid} className={styles.snippetItem}>
            <h3>{snippet.title}</h3>
            <p>{snippet.content}</p>



            {/* Associated Tags */}
            <div className={styles.tags}>
              <strong>Tags:</strong>
              {snippet.realmsIntegrated && snippet.realmsIntegrated.length > 0 ? (
                snippet.realmsIntegrated.map((realm) => (
                  <>
                    <Link key={realm.uuid} href={`/realms/${realm.uuid}`}>
                      <a className={styles.tag}>{realm.name}</a>
                    </Link>
                  </>
                ))
              ) : (
                <span>No tags available</span>
              )}
            </div>
          </div>
        ))}
      </div></>
  );
}
