   import { useState, useEffect } from 'react';
   import { db, auth } from '../lib/firebase';  // Imports from your lib/firebase.js
   import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
   import { onAuthStateChanged } from 'firebase/auth';
   import { motion } from 'framer-motion';  // For fun animations

   export default function Assignments() {  // Required default export for Next.js
     const [assignments, setAssignments] = useState([]);
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [completedCount, setCompletedCount] = useState(0);  // For fun progress tracking

     useEffect(() => {
       // Listen for user login (student)
       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if (currentUser) {
           setUser(currentUser);
           fetchAssignments(currentUser.uid);
         } else {
           setLoading(false);
         }
       });
       return unsubscribe;
     }, []);

     const fetchAssignments = async (studentId) => {
       try {
         const q = query(collection(db, 'assignments'), where('studentId', '==', studentId));
         const querySnapshot = await getDocs(q);
         const assignmentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setAssignments(assignmentList);
         setCompletedCount(assignmentList.filter(ass => ass.completed).length);  // Update progress
       } catch (error) {
         console.error('Error fetching assignments:', error);
         alert('Oops! Could not load assignments. Try again.');
       } finally {
         setLoading(false);
       }
     };

     const markCompleted = async (assignmentId) => {
       try {
         const assignmentRef = doc(db, 'assignments', assignmentId);
         await updateDoc(assignmentRef, { completed: true });
         // Update local state for instant feedback
         setAssignments(assignments.map(ass => 
           ass.id === assignmentId ? { ...ass, completed: true } : ass
         ));
         setCompletedCount(completedCount + 1);
         // Fun feedback: Alert with emoji (replace with sound/modal if desired)
         alert('Great job! Assignment completed! 🎉 Keep practicing!');
       } catch (error) {
         console.error('Error updating assignment:', error);
         alert('Error marking as completed. Try again.');
       }
     };

     if (loading) return <div className="p-8 text-center">Loading your assignments... 📚</div>;
     if (!user) return <div className="p-8 text-center">Please log in to view your assignments.</div>;

     return (
       <div className="p-8 bg-gradient-to-br from-blue-100 to-green-100 min-h-screen">
         <h1 className="text-3xl font-bold mb-4 text-center">Your Assignments</h1>
         <p className="text-center mb-6">Completed: {completedCount}/{assignments.length} – You're doing awesome! 🌟</p>
         
         {assignments.length === 0 ? (
           <p className="text-center text-gray-600">No assignments yet. Your teacher will add some soon!</p>
         ) : (
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {assignments.map((assignment) => (
               <motion.div
                 key={assignment.id}
                 className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200"
                 whileHover={{ scale: 1.05, rotate: 1 }}  // Fun hover effect
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
               >
                 <h2 className="text-xl font-semibold mb-2">
                   {assignment.type === 'homework' ? '🏠 Homework' : '📚 Classwork'}: {assignment.description}
                 </h2>
                 <p className="mb-2"><strong>Words to Practice:</strong> {assignment.words ? assignment.words.join(', ') : 'None'}</p>
                 {assignment.sentencePrompt && (
                   <p className="mb-4 italic text-gray-700">💬 Communicative Task: {assignment.sentencePrompt} (e.g., "Use the word in a fun story!")</p>
                 )}
                 {assignment.completed ? (
                   <p className="text-green-600 font-bold">✅ Completed! Well done!</p>
                 ) : (
                   <motion.button
                     onClick={() => markCompleted(assignment.id)}
                     className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold"
                     whileTap={{ scale: 0.9 }}  // Fun tap animation
                   >
                     Mark as Completed
                   </motion.button>
                 )}
               </motion.div>
             ))}
           </div>
         )}
         
         {/* Fun Extra: Encouragement based on progress */}
         {completedCount === assignments.length && assignments.length > 0 && (
           <motion.div 
             className="mt-8 text-center bg-yellow-200 p-4 rounded-lg"
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
           >
             <h3 className="text-2xl font-bold">🎉 All Done! You're a Pronunciation Pro!</h3>
             <p>Time for a game? Head to the practice page!</p>
           </motion.div>
         )}
       </div>
     );
   }
   
