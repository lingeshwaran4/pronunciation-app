// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from './layout';  // Import from layout

// Define the Assignment interface
interface Assignment {
  id: string;
  studentId: string;
  words: string[];
  type: string;
  description: string;
  completed: boolean;
  sentencePrompt: string;
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'assignments'), where('studentId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data: Assignment[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Assignment));
      setAssignments(data);
      setLoading(false);
    };
    fetchAssignments();
  }, []);

  const markCompleted = async (id: string) => {
    await updateDoc(doc(db, 'assignments', id), { completed: true });
    setAssignments(assignments.map((assignment: Assignment) =>
      assignment.id === id ? { ...assignment, completed: true } : assignment
    ));
  };

  return (
    <div>
      <h1>My Assignments</h1>
      {loading ? <p>Loading...</p> : (
        assignments.map((assignment: Assignment) => (
          <div key={assignment.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{assignment.description}</h3>
            <p>Words: {assignment.words.join(', ')}</p>
            <p>Type: {assignment.type}</p>
            <p>Completed: {assignment.completed ? 'Yes' : 'No'}</p>
            {!assignment.completed && (
              <button onClick={() => markCompleted(assignment.id)}>Mark as Completed</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
