import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Snippets.module.css';
import Link from 'next/link';
import { PiGraphBold } from "react-icons/pi";
import { MdOutlineAutoGraph } from "react-icons/md";
import { useKnowledgeGraph } from '../../context/KnowledgeGraphContext';
import { useSnippets } from '../../context/SnippetsContext';
import { LuSearch } from "react-icons/lu";
import { CircleLoader } from 'react-spinners';

export default function Snippets() {
  const [currentSnippet, setCurrentSnippet] = useState('');
  const [snippetId, setSnippetId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const { setRealmData } = useKnowledgeGraph();
  const { snippets, setSnippets } = useSnippets();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false); // To distinguish between search and recent
  const [totalPages, setTotalPages] = useState(1);

  // Fetch recent snippets on load
  useEffect(() => {
    if (!isSearching && snippets.length === 0) fetchRecentSnippets(currentPage);
  }, [currentPage, isSearching]);

  const fetchRecentSnippets = async (page = 1) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/mind-snippets/recent?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSnippets(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching recent snippets:', error);
    }
  };

  const searchSnippets = async (page = 1) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/mind-snippets/search`, {
        params: {
          query: searchQuery,
          page: page,
          size: 5,
          searchRealm: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSnippets(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
      setIsSearching(false);
    } catch (error) {
      console.error('Error searching snippets:', error);
    }
  };

  const handleSnippetBlur = async () => {
    if (currentSnippet.trim()) {
      setIsSaving(true); // Start showing the loader
      setSaveMessage('Saving...'); // Initial save message

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

        setSnippetId(response.data.uuid); // Store new snippet ID
        setSaveMessage('Snippet saved successfully!'); // Success message

        // Delay clearing the form and fetching new snippets
        setTimeout(() => {
          setCurrentSnippet('');
          setRealmData([]);
          setSnippets([]);
          fetchRecentSnippets(); 
        }, 13000);

      } catch (error) {
        console.error('Error saving snippet:', error);
        setSaveMessage('Error saving snippet. Please try again.');
      } finally {
        setIsSaving(false); // Hide loader
        setTimeout(() => setSaveMessage(''), 2000); // Clear message after 2 seconds
      }
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1); // Reset to page 1 on new search
    searchSnippets(1); // Fetch first page of search results
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (isSearching) {
      searchSnippets(page); // Navigate through search results
    } else {
      fetchRecentSnippets(page); // Navigate through recent snippets
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

      {/* Sleek silver search bar */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
  <div className={styles.searchContainer}>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search snippets..."
      className={styles.searchBar}
    />
    <button type="submit" className={styles.searchIcon}>
      <LuSearch />
    </button>
    {isSearching && <CircleLoader color="#FFD700" size={25} className={styles.loader} />}
  </div>
</form>

      {/* Snippet List */}
      <div className={styles.snippetList}>
        {snippets.map((snippet) => (
          <div key={snippet.uuid} className={styles.snippetItem}>
            <h3>{snippet.title}</h3>
            <p>{snippet.content}</p>

            <div className={styles.realmInfo}>
              <div className={styles.realmConnection}>
                {snippet?.realm?.parentRealm && (
                  <>
                    <Link href={`/realms/${snippet?.realm?.parentRealm?.uuid}`}>
                      <a className={styles.realmLink}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent' }}>
                          <PiGraphBold style={{ color: '#FDDE55', marginRight: '0.25rem', fontSize: '1.2rem' }} />
                          {snippet?.realm?.parentRealm?.name}
                        </div>
                      </a>
                    </Link>
                    <span className={styles.arrow}>→</span>
                  </>
                )}
                <Link href={`/realms/${snippet.realm?.uuid}`}>
                  <a className={styles.realmLink}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent' }}>
                      <PiGraphBold style={{ color: '#FDDE55', marginRight: '0.25rem', fontSize: '1.2rem' }} />
                      {snippet.realm?.name}
                    </div>
                  </a>
                </Link>
              </div>
            </div>

            <div className={styles.tags}>
              {snippet.realmsIntegrated && snippet.realmsIntegrated.length > 0 ? (
                snippet.realmsIntegrated.map((realm) => (
                  <Link key={realm.uuid} href={`/realms/${realm?.uuid}`}>
                    <a className={styles.tag}>
                      <MdOutlineAutoGraph style={{ color: '#FDDE55', marginRight: '0.25rem' }} />
                      {realm?.name}
                    </a>
                  </Link>
                ))
              ) : (
                <span>No concepts available</span>
              )}
            </div>

            <div className={styles.createdAt}>
              Created At: {new Date(snippet.createdAt +'z').toLocaleString('en-US', {
  day: 'numeric',
  month: 'short', // Change to 'long' for full month names
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,  // Use false for 24-hour format
})
}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages - 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ''}
          >
            pages  {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
  
}
