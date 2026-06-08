import { useState, useEffect } from 'react'
import './App.css'
import Timer from './components/Timer'
import SubjectForm from './components/SubjectForm'

import { API_URL } from './config';

export interface Subject {

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [stats, setStats] = useState<any[]>([]);

  const fetchSubjects = async () => {
    try {
      console.log('Fetching subjects...');
      const res = await fetch(`${API_URL}/subjects`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      console.log('Subjects loaded:', data);
      setSubjects(data);
    } catch (err) {
      console.error('Failed to fetch subjects', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchStats();
  }, []);

  const handleSubjectSelect = (subject: Subject) => {
    console.log('Selected subject:', subject);
    setCurrentSubject(subject);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Study Timer</h1>
      </header>
      
      <main>
        <div className="timer-section">
          <Timer 
            currentSubject={currentSubject} 
            onSessionComplete={() => {
              fetchStats();
            }} 
          />
        </div>

        <div className="subjects-section">
          <h2>Subjects</h2>
          <div className="subject-list">
            {subjects.length === 0 && <p style={{ color: '#888' }}>과목을 먼저 추가해주세요.</p>}
            {subjects.map(subject => (
              <button 
                key={subject.id}
                className={`subject-item ${currentSubject?.id === subject.id ? 'active' : ''}`}
                style={{ 
                  '--subject-color': subject.color,
                  borderLeft: `5px solid ${subject.color}`
                } as any}
                onClick={() => handleSubjectSelect(subject)}
              >
                {subject.name}
              </button>
            ))}
          </div>
          <SubjectForm onSubjectAdded={fetchSubjects} />
        </div>

        <div className="stats-section">
          <h2>Stats</h2>
          <div className="stats-list">
            {stats.map(stat => (
              <div key={stat.name} className="stat-item">
                <span className="dot" style={{ backgroundColor: stat.color }}></span>
                <span className="name">{stat.name}:</span>
                <span className="time">{Math.floor(stat.total_seconds / 60)}m {stat.total_seconds % 60}s</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
