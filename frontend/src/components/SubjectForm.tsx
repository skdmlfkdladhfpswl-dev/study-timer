import { useState } from 'react';

interface SubjectFormProps {
  onSubjectAdded: () => void;
}

import { API_URL } from '../config';

const SubjectForm = ({ onSubjectAdded }: SubjectFormProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3498db');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });
      
      if (res.ok) {
        setName('');
        console.log('Subject added successfully');
        onSubjectAdded(); // 목록 새로고침 호출
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'Failed to add subject'}`);
      }
    } catch (err) {
      console.error('Failed to add subject', err);
      alert('서버 연결에 실패했습니다. 백엔드가 실행 중인지 확인하세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="subject-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="과목명 입력 (예: 수학, 영어)" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        required 
      />
      <input 
        type="color" 
        value={color} 
        onChange={(e) => setColor(e.target.value)} 
        title="과목 색상 선택"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '추가 중...' : '과목 추가'}
      </button>
    </form>
  );
};

export default SubjectForm;
