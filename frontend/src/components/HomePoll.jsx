import { useEffect, useMemo, useState } from 'react';
import './HomePoll.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

const pollOptions = [
  'Actively looking',
  'Open to opportunities',
  'Not looking',
  'Just browsing',
];

const defaultVotes = {
  'Actively looking': 0,
  'Open to opportunities': 0,
  'Not looking': 0,
  'Just browsing': 0,
};

const GUEST_ID_KEY = 'joblyhub_poll_guest_id';

const getGuestId = () => {
  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    guestId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
};

export default function HomePoll() {
  const [selected, setSelected] = useState('');
  const [votes, setVotes] = useState(defaultVotes);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  const token =
    localStorage.getItem('joblyhubToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('userToken');

  const guestId = getGuestId();

  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );
  }, [votes]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(
        `${API_URL}/polls/home-job-status?guestId=${guestId}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to load poll');
      }

      setVotes({ ...defaultVotes, ...data.results });
      setSelected(data.userVote || '');
    } catch (err) {
      setError(err.message || 'Unable to load poll');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVote = async (option) => {
    try {
      if (selected === option) return;

      setVoting(true);
      setError('');

      const res = await fetch(`${API_URL}/polls/home-job-status/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          option,
          guestId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to record vote');
      }

      setVotes({ ...defaultVotes, ...data.results });
      setSelected(data.userVote || option);
    } catch (err) {
      setError(err.message || 'Unable to record vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <section className="home-poll">
      <div className="poll-card">
        <div className="poll-top">
          <span className="poll-badge">Community Poll</span>
          {selected && <span className="poll-status">Vote recorded</span>}
        </div>

        <h2>What is your current job search status?</h2>

        <p>
          Your response helps JoblyHub understand what job seekers need most.
        </p>

        {loading ? (
          <div className="poll-loading">Loading poll...</div>
        ) : (
          <div className="poll-options">
            {pollOptions.map((option) => {
              const count = Number(votes[option] || 0);
              const percentage =
                totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

              const isSelected = selected === option;

              return (
                <button
                  type="button"
                  key={option}
                  className={`poll-option ${isSelected ? 'selected' : ''} ${
                    selected ? 'voted' : ''
                  }`}
                  onClick={() => handleVote(option)}
                  disabled={voting}
                >
                  {selected && (
                    <span
                      className="poll-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <span className="poll-content">
                    <span className="poll-dot" />
                    <span className="poll-label">{option}</span>
                  </span>

                  {selected && (
                    <span className="poll-result">
                      <strong>{percentage}%</strong>
                      <small>
                        {count} vote{count !== 1 ? 's' : ''}
                      </small>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {error && <div className="poll-error">{error}</div>}

        <div className="poll-footer">
          {selected ? (
            <span>
              Total votes: <strong>{totalVotes}</strong> · You selected:{' '}
              <strong>{selected}</strong>
            </span>
          ) : (
            <span>Select one option to vote.</span>
          )}
        </div>
      </div>
    </section>
  );
}